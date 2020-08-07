const passport = require('passport');
const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const cloudinary = require('../config/cloudinary');
const Admin = require('../models/Admin');
const {
	obtenerRepartidores,
	obtenerRepartidor,
} = require('./deliverers.controller');

exports.mostrarInicio = (req, res) => {
	res.render('admin/index', {
		titulo: 'Panel de administracion | FastShopping',
	});
};

exports.mostrarRegistroRepartidor = (req, res) => {
	res.render('admin/register-deliverer', {
		titulo: 'Registrar repartidor',
	});
};

exports.mostrarLogin = (req, res) => {
	res.render('auth/admin-login', {
		titulo: 'Iniciar Sesión Administrador | FastShopping',
	});
};

exports.mostrarConfiguracion = (req, res) => {
	res.render('admin/settings', {
		titulo: 'Configuración de Administrador',
	});
};

exports.mostrarRepartidores = async (req, res) => {
	try {
		const repartidores = await obtenerRepartidores();
		res.render('admin/deliverers-list', {
			titulo: 'Plantilla de Repartidores',
			repartidores,
		});
	} catch (err) {
		res.render('admin/deliverers-list', {
			titulo: 'Plantilla de Repartidores',
			errorRepartidores:
				'Ocurrió un error al obtener los repartidores. Por favor intente nuevamente',
		});
	}
};

exports.mostrarRepartidor = async (req, res) => {
	let { id } = req.params;
	id = Number(id);
	if (isNaN(id) || id < 1) {
		req.flash('feedbackError', 'El identificador no es válido');
		return res.redirect('/admin/plantilla-repartidores');
	}
	try {
		const repartidor = await obtenerRepartidor(id);
		res.render('admin/deliverer-details', {
			titulo: 'Perfil de Repartidor',
			repartidor,
		});
	} catch (err) {
		req.flash(
			'feedbackError',
			'Ocurrió un error al obtener el repartidor. O puede que no exista'
		);
		res.redirect('/admin/plantilla-repartidores');
	}
};

exports.crearAdmin = async (req, res) => {
	const { nombre, apellido, email, password } = req.body;
	try {
		const hash = await bcrypt.hash(password, 10);
		const admin = await Admin.create({
			nombre,
			apellido,
			email,
			password: hash,
		});
		res.json({ ok: true, admin });
	} catch (err) {
		console.log(err);
		res.json({ ok: false, error: err });
	}
};

exports.iniciarSesion = passport.authenticate('admin-local', {
	failureRedirect: '/admin/login',
	successRedirect: '/admin',
	failureFlash: true,
});

exports.cerrarSesion = (req, res) => {
	req.logout();
	req.flash('feedbackExito', 'Se ha cerrado sesión');
	res.redirect('/admin/login');
};

exports.actualizarAdmin = async (req, res) => {
	const { id, nombre, apellido, email, password } = req.body;
	try {
		let admin = await Admin.findByPk(id);
		if (!admin) {
			req.flash(
				'feedbackError',
				'Los datos proporcionados son incorrectos. Por favor intente de nuevo'
			);
			throw new Error('Datos incorrectos: ID no existe');
		}
		let imagenSubida;
		if (req.file) {
			imagenSubida = await cloudinary.v2.uploader.upload(req.file.path);
			await fs.unlink(req.file.path);
		}
		const urlAvatar = imagenSubida
			? imagenSubida.secure_url
			: admin.urlAvatar;
		admin.nombre = nombre;
		admin.apellido = apellido;
		admin.email = email;
		if (password) {
			admin.password = await bcrypt.hash(password, 10);
		}
		admin.urlAvatar = urlAvatar;
		await admin.save();
		req.flash('feedbackExito', '¡Cuenta actualizada!');
	} catch (err) {
		console.log(err);
		req.flash(
			'feedbackError',
			'Ocurrió un error al actualizar la cuenta. Por favor intente de nuevo'
		);
	}
	res.redirect('/admin/configuracion');
};
