const Articulo = require('../models/Item');
const Pedido = require('../models/Order');
const router = require('../routes/auth.routes');

exports.crearPedido = async (req, res) => {
	// En el cuerpo de la petición debe recibir las propiedades
	// articulos[]
	// infoPedido: {
	//  notas:
	//  idCliente,
	//
	// }
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
		res.json({
			ok: true,
			pedidoDB,
			articulosDB,
		});
	} catch (err) {
		console.log(err);
		res.json({
			error: err,
		});
	}
};

exports.obtenerPedidos = async (req, res) => {
	try {
		const pedidos = await Pedido.findAll();
		res.json({ pedidos });
	} catch (err) {
		console.log(err);
		res.json({ ok: false, mensaje: 'Error inesperado' });
	}
};

exports.obtenerPedido = async (req, res) => {
	const { id } = req.params;
	try {
		const pedido = await Pedido.findOne({
			where: {
				idPedido: id,
			},
		});
		if (!pedido) {
			return res.json({ ok: true, mensaje: 'El pedido no existe' });
		}
		const articulos = await Articulo.findAll({
			where: {
				idPedido: pedido.idPedido,
			},
		});

		res.json({
			ok: true,
			pedido,
			articulos,
		});
	} catch (err) {
		console.log(err);
		res.json({ ok: false, mensaje: 'Error inesperado' });
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
