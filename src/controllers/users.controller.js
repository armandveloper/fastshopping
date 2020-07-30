const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const Usuario = require('../models/User');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.crearUsuario = async (req, res) => {
	const { nombre, apellido, email, password, telefono } = req.body;
	try {
		const resultado = await Usuario.findOne({
			where: {
				[Op.or]: { email, telefono },
			},
		});
		if (resultado) {
			return res.json({ ok: false, mensaje: 'La cuenta ya existe' });
		}
		const hash = await bcrypt.hash(password, 10);
		await Usuario.create({
			nombre,
			apellido,
			email,
			password: hash,
			telefono,
		});
		res.redirect('/login');
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			error: err,
		});
	}
};
exports.obtenerUsuarioPorEmail = async (req, res) => {
	const { email } = req.params;
	console.log(email);
	console.log(typeof email);

	try {
		const usuario = await Usuario.findOne({ where: { email } });
		if (!usuario) {
			return res.status(404).json({
				ok: false,
				mensaje: 'La cuenta no existe',
			});
		}
		res.json({
			ok: true,
			usuario,
		});
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			mensaje:
				'Ocurrió un error al realizar la búsqueda por favor intente de nuevo',
		});
	}
};

exports.actualizarUsuario = async (req, res) => {
	// const {
	// 	nombre,
	// 	apellido,
	// 	email,
	// 	telefono,
	// 	colonia,
	// 	calle,
	// 	numExt,
	// 	numInt,
	// 	referencias,
	// } = req.body;
	// try {
	//   const usuario = await Usuario.findOne({ where: { email } });

	//   usuario.save();

	// } catch (err) {
	//   console.log(err);
	// }
	res.json({
		...req.body,
	});
};

exports.actualizarAvatar = async (req, res) => {
	const { idUsuario } = req.body;
	const imagenSubida = await cloudinary.v2.uploader.upload(req.file.path);
	const usuario = await Usuario.findByPk(idUsuario);
	usuario.urlAvatar = imagenSubida.secure_url;
	await usuario.save();
	await fs.unlink(req.file.path);
	res.json({
		usuario,
	});
};
