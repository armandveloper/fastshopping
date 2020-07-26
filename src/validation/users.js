const { body, validationResult } = require('express-validator');

exports.validarUsuario = [
	body('nombre')
		.not()
		.isEmpty()
		.withMessage('Ingrese su nombre')
		.trim()
		.escape(),
	body('apellido')
		.not()
		.isEmpty()
		.withMessage('Ingrese su apellido')
		.trim()
		.escape(),
	body('email')
		.isEmail()
		.withMessage('El email es inválido')
		.normalizeEmail(),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Ingrese su contraseña')
		.trim()
		.escape(),
	body('telefono')
		.isMobilePhone('es-MX')
		.withMessage('El teléfono no es válido'),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			return res
				.status(400)
				.json({ ok: false, errores: errores.array() });
		}
		next();
	},
];
exports.validarInicioSesion = [
	body('email')
		.isEmail()
		.withMessage('El email es inválido')
		.normalizeEmail(),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Ingrese su contraseña')
		.trim()
		.escape(),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			req.flash(
				'feedbackError',
				errores.array().map((error) => error.msg)
			);
			return res.redirect('/login');
		}
		next();
	},
];
