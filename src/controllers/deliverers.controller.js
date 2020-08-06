const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const passport = require('passport');
const moment = require('moment');
const cloudinary = require('../config/cloudinary');
const socket = require('../realtime/client');
const Repartidor = require('../models/Deliverer');
const { obtenerPedidos, obtenerPedido } = require('./orders.controller');
const { enviarNotificacion } = require('./notifications.controller');

moment.locale('es');

exports.crearRepartidor = async (req, res) => {
	const { nombre, apellido, email, password, telefono } = req.body;
	try {
		let hash = await bcrypt.hash(password, 10);
		const imagenSubida = await cloudinary.v2.uploader.upload(req.file.path);
		const urlAvatar = imagenSubida.secure_url;
		const repartidor = await Repartidor.create({
			nombre,
			apellido,
			email,
			password: hash,
			telefono,
			urlAvatar,
		});
		await fs.unlink(req.file.path);
		res.json({
			ok: true,
			mensaje: 'Repartidor registrado',
			repartidor,
		});
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			error: err,
		});
	}
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
		console.log(object);
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
