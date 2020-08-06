const moment = require('moment');
const Pedido = require('../models/Order');
const Articulo = require('../models/Item');
const Usuario = require('../models/User');
const socket = require('../realtime/client');
const { enviarNotificacion } = require('./notifications.controller');

moment.locale('es');

const actualizarImporte = async (idPedido, importe) => {
	const pedido = await Pedido.findByPk(idPedido);
	pedido.importe = importe;
	pedido.total = importe + (importe * pedido.comision) / 100;
	return await pedido.save();
};

const actualizarEstado = async (idPedido) => {
	const pedido = await Pedido.findByPk(idPedido);
	pedido.entregado = !pedido.entregado;
	return await pedido.save();
};

exports.crearPedido = async (req, res) => {
	const { articulos, infoPedido } = req.body;
	try {
		const pedidoDB = await Pedido.create({
			...infoPedido,
			comision: 20,
		});
		const articulos2 = articulos.map((articulo) => ({
			...articulo,
			idPedido: pedidoDB.idPedido,
		}));
		const articulosDB = await Articulo.bulkCreate(articulos2);
		const cliente = await Usuario.findOne({
			where: {
				idUsuario: pedidoDB.idReceptor,
			},
			attributes: { exclude: ['password'] },
		});
		socket.emit('nuevoPedido', {
			info: pedidoDB,
			articulos: articulosDB,
			creadoEl: moment(pedidoDB.creadoEl, 'YYYYMMDD').fromNow(),
			cliente,
		});
		res.json({
			ok: true,
		});
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			error: err,
		});
	}
};

// Obtener todos los pedidos
// exports.obtenerPedidos = async (req, res) => {
// 	try {
// 		const pedidos = await Pedido.findAll();
// 		const pedidosConArticulos = await Promise.all(
// 			pedidos.map(async (pedido) => {
// 				const articulos = await Articulo.findAll({
// 					where: {
// 						idPedido: pedido.idPedido,
// 					},
// 				});
// 				return { info: pedido, articulos };
// 			})
// 		);
// 		res.json({ ok: true, pedidos: pedidosConArticulos });
// 	} catch (err) {
// 		console.log(err);
// 		res.json({ ok: false, mensaje: 'Error inesperado' });
// 	}
// };
// Obtener pedidos pendientes

exports.obtenerPedidos = async () => {
	try {
		const pedidos = await Pedido.findAll({ where: { enProceso: false } });
		const pedidosConArticulos = await Promise.all(
			pedidos.map(async (pedido) => {
				let creadoEl = moment(pedido.creadoEl, 'YYYYMMDD').fromNow();
				const articulos = await Articulo.findAll({
					where: {
						idPedido: pedido.idPedido,
					},
				});
				const cliente = await Usuario.findOne({
					where: {
						idUsuario: pedido.idReceptor,
					},
					attributes: { exclude: ['password'] },
				});
				return { creadoEl, info: pedido, articulos, cliente };
			})
		);
		return pedidosConArticulos;
	} catch (err) {
		throw new Error(err.message);
	}
};

// exports.obtenerPedido = async (req, res) => {
// 	const { id } = req.params;
// 	try {
// 		const pedido = await Pedido.findOne({
// 			where: {
// 				idPedido: id,
// 			},
// 		});
// 		if (!pedido) {
// 			return res.json({ ok: true, mensaje: 'El pedido no existe' });
// 		}
// 		const articulos = await Articulo.findAll({
// 			where: {
// 				idPedido: pedido.idPedido,
// 			},
// 		});

// 		res.json({
// 			ok: true,
// 			pedido: {
// 				info: pedido,
// 				articulos,
// 			},
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		res.json({ ok: false, mensaje: 'Error inesperado' });
// 	}
// };

exports.obtenerPedido = async (idPedido) => {
	try {
		let pedido = await Pedido.findByPk(idPedido, {
			include: Articulo,
		});
		if (!pedido) {
			throw new Error('El pedido no existe');
		}
		let enviarNotificacion = !pedido.enProceso;
		pedido.enProceso = true;
		pedido = await pedido.save();
		const cliente = await Usuario.findByPk(pedido.idReceptor, {
			attributes: {
				exclude: ['password'],
			},
		});
		let creadoEl = moment(pedido.creadoEl, 'YYYYMMDD').fromNow();
		return { pedido, cliente, creadoEl, enviarNotificacion };
	} catch (err) {
		throw new Error(err.message);
	}
};

exports.actualizarPedido = async (req, res) => {
	const { campoActualizar, idPedido } = req.body;
	if (campoActualizar === 'importe') {
		try {
			const pedido = await actualizarImporte(
				idPedido,
				Number(req.body.importe)
			);
			let idNotificacion = await enviarNotificacion(pedido.idUsuario, {
				titulo: 'Pedido en camino',
				texto: `Nuestros repartidores han realizado su compra, la cual tiene un monto de $${pedido.total}. En breve recibirá su pedido`,
			});
			console.log('Emitiendo evento');
			socket.emit('pagoActualizado', {
				actualizadoEl: moment(
					pedido.actualizadoEl,
					'YYYYMMDD'
				).fromNow(),
				importe: pedido.importe,
				total: pedido.total,
				idCliente: pedido.idUsuario,
				idNotificacion,
				titulo: 'Pedido en camino',
				texto: `Nuestros repartidores han realizado su compra, la cual tiene un monto de $${pedido.total}. En breve recibirá su pedido`,
			});
			console.log('Evento enviado');
			res.json({
				ok: true,
				pedido,
			});
		} catch (err) {
			console.log(err);
			res.json({
				ok: false,
				error: err,
				mensaje:
					'Ocurrió un error al actualizar el importe, inténtelo de nuevo',
			});
		}
		return;
	}
	try {
		const pedido = await actualizarEstado(idPedido);
		res.json({
			ok: true,
		});
		const usuario = await Usuario.findByPk(pedido.idUsuario, {
			attributes: ['nombre', 'apellido'],
		});
		let idNotificacion = await enviarNotificacion(pedido.idUsuario, {
			titulo: 'Pedido entregado',
			texto: `Hemos entregado su pedido a ${usuario.nombre} ${usuario.apellido} ¡Gracias por confiar en FastShopping!`,
		});
		console.log('Emitiendo evento');
		socket.emit('pedidoEntregado', {
			actualizadoEl: moment(pedido.actualizadoEl, 'YYYYMMDD').fromNow(),
			idCliente: pedido.idUsuario,
			idNotificacion,
			titulo: 'Pedido entregado',
			texto: `Hemos entregado su pedido a ${usuario.nombre} ${usuario.apellido} ¡Gracias por confiar en FastShopping!`,
		});
		console.log('Evento enviado');
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			error: err,
			mensaje:
				'Ocurrió un error al marcar el pedido como entregado. Por favor inténtelo de nuevo',
		});
	}
};

exports.eliminarPedido = async (req, res) => {
	const { id } = req.params;
	try {
		await Pedido.destroy({
			where: {
				idPedido: id,
			},
		});
		res.json({ ok: true, mensaje: 'Pedido eliminado', idPedido: id });
	} catch (err) {
		console.log(err);
		res.json({ ok: false, mensaje: 'Error al eliminar' });
	}
};
