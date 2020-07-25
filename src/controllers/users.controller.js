const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require('../models/User');

exports.createUser = async (req, res) => {
	const { nombre, apellido, email, password, telefono } = req.body;
	try {
		const resultado = await User.findOne({
			where: {
				[Op.or]: { email, telefono },
			},
		});
		if (resultado) {
			return res.json({ ok: false, mensaje: 'La cuenta ya existe' });
		}
		const hash = await bcrypt.hash(password, 10);
		const usuario = await User.create({
			nombre,
			apellido,
			email,
			password: hash,
			telefono,
		});
		// Redirigir al login
		// res.render('auth/login');

		res.json({
			ok: true,
			usuario,
		});
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			error: err,
		});
	}
};
