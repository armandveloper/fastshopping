const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Usuario = require('../models/User');

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
