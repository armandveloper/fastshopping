const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const passport = require('passport');
const moment = require('moment');
const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinary');
const socket = require('../realtime/client');
const Repartidor = require('../models/Deliverer');
const { obtenerPedidos, obtenerPedido } = require('./orders.controller');
const { enviarNotificacion } = require('./notifications.controller');

moment.locale('es');

exports.crearRepartidor = async (req, res) => {
	const { nombre, apellido, email, password, telefono } = req.body;
	try {
		let repartidor = await Repartidor.findOne({
			where: {
				[Op.or]: { email, telefono },
			},
		});
		if (repartidor) {
			req.flash(
				'feedbackError',
				'Ya hay una cuenta asociada con ese email o teléfono'
			);
			return res.redirect('/admin/registrar-repartidor');
		}
		let hash = await bcrypt.hash(password, 10);
		const imagenSubida = await cloudinary.v2.uploader.upload(req.file.path);
		const urlAvatar = imagenSubida.secure_url;
		await Repartidor.create({
			nombre,
			apellido,
			email,
			password: hash,
			telefono,
			urlAvatar,
		});
		await fs.unlink(req.file.path);
		req.flash('feedbackExito', 'Se ha creado otro repartidor');
	} catch (err) {
		console.log(err);
		req.flash(
			'feedbackError',
			'Ocurrió un error en el registro. Por favor intente nuevamente'
		);
	}
	res.redirect('/admin/registrar-repartidor');
};

exports.actualizarRepartidor = async (req, res) => {
	const { idRepartidor, nombre, apellido, password, telefono } = req.body;
	try {
		let repartidor = await Repartidor.findByPk(idRepartidor);
		if (!repartidor) {
			req.flash(
				'feedbackError',
				'Los datos proporcionados son incorrectos. Por favor intente de nuevo'
			);
			throw new Error('Datos incorrectos: ID no existe');
		}
		repartidor.nombre = nombre;
		repartidor.apellido = apellido;
		repartidor.telefono = telefono;
		if (password) {
			repartidor.password = await bcrypt.hash(password, 10);
		}
		await repartidor.save();
		req.flash('feedbackExito', '¡Cuenta actualizada!');
	} catch (err) {
		console.log(err);
		req.flash(
			'feedbackError',
			'Ocurrió un error al actualizar la cuenta. Por favor intente de nuevo'
		);
	}
	res.redirect('/admin/plantilla-repartidores/' + idRepartidor);
};

exports.iniciarSesion = passport.authenticate('deliverer-local', {
	failureRedirect: '/repartidores/login',
	successRedirect: '/repartidores',
	failureFlash: true,
});

exports.cerrarSesion = (req, res) => {
	req.logout();
	req.flash('feedbackExito', 'Se ha cerrado sesión');
	res.redirect('/repartidores/login');
};

exports.mostrarInicio = async (req, res) => {
	try {
		const pedidos = await obtenerPedidos();
		res.render('deliverers/index', {
			titulo: 'Atención de Pedidos | FastShopping',
			pedidos,
		});
	} catch (err) {
		console.log(err);
		res.render('/deliverers/index', {
			titulo: 'Atención de Pedidos | FastShopping',
			errorPedidos:
				'Ocurrió un error al cargar los Pedidos. Por favor recargue la página o inicie sesión de nuevo',
		});
	}
};

exports.mostrarDetallesPedido = async (req, res) => {
	const { id } = req.params;
	try {
		socket.emit('yaFueAtendido', id);
		const pedido = await obtenerPedido(id);
		res.render('deliverers/details', {
			titulo: 'Detalles del Pedido',
			pedido,
		});
		if (!pedido.enviarNotificacion) {
			return;
		}
		let idNotificacion = await enviarNotificacion(pedido.pedido.idUsuario, {
			titulo: 'Pedido en proceso',
			texto: `Su pedido está siendo atendido por uno de nuestros repartidores. En breve recibirá actualizaciones sobre su estado.`,
		});
		socket.emit('pedidoEnProceso', {
			titulo: 'Pedido en proceso',
			texto:
				'Su pedido está siendo atendido por uno de nuestros repartidores. En breve recibirá actualizaciones sobre su estado.',
			actualizadoEl: moment(
				pedido.pedido.actualizadoEl,
				'YYYYMMDD'
			).fromNow(),
			idNotificacion,
			idCliente: pedido.pedido.idUsuario,
		});
	} catch (err) {
		console.log(err);
		res.render('deliverers/details', {
			titulo: 'Detalles del Pedido',
			errorPedido:
				'Ocurrió un error al cargar los detales del pedido. Por favor recargue la página o inicie sesión de nuevo',
		});
	}
};

exports.mostrarLogin = (req, res) => {
	res.render('auth/deliverer-login', {
		titulo: 'Iniciar Sesión Repartidores | FastShopping',
	});
};

exports.obtenerRepartidores = async () => {
	try {
		return await Repartidor.findAll({
			attributes: {
				exclude: ['password'],
			},
		});
	} catch (err) {
		throw new Error('Error al obtener los Repartidores');
	}
};

exports.obtenerRepartidor = async (id) => {
	try {
		const repartidor = await Repartidor.findByPk(id, {
			attributes: {
				exclude: ['password'],
			},
		});
		if (!repartidor) {
			throw new Error('Error al obtener repartidor');
		}
		return repartidor;
	} catch (err) {
		throw new Error('Error al obtener repartidor');
	}
};

exports.eliminarRepartidor = async (req, res) => {
	const { id } = req.body;
	try {
		await Repartidor.destroy({
			where: {
				idRepartidor: id,
			},
		});
		res.json({ ok: true });
	} catch (err) {
		res.json({ ok: false });
	}
};
