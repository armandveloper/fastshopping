const { body, param, validationResult } = require('express-validator');
exports.validarEmail = [
	param('email')
		.isEmail()
		.withMessage('El email no es válido')
		.normalizeEmail(),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			return res.status(400).json({
				ok: false,
				mensaje: errores.array()[0].msg,
			});
		}
		next();
	},
];
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
		.withMessage('El email no es válido')
		.normalizeEmail(),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Ingrese su contraseña')
		.trim()
		.escape()
		.isLength({ min: 8, max: 16 })
		.withMessage('La contraseña debe ser de 8 a 16 carácteres'),
	body('telefono')
		.isMobilePhone('es-MX')
		.withMessage('El teléfono no es válido'),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			// res.locals.nombre = req.body.nombre ? req.body.nombre : '';
			// res.locals.apellido = req.body.apellido ? req.body.apellido : '';
			// res.locals.email = req.body.email ? req.body.email : '';
			// res.locals.telefono = req.body.telefono ? req.body.telefono : '';
			req.flash(
				'feedbackError',
				errores.array().map((error) => error.msg)
			);
			return res.redirect('/registro');
		}
		next();
	},
];
exports.validarInicioSesion = [
	body('email')
		.isEmail()
		.withMessage('El email no es válido')
		.normalizeEmail(),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Ingrese su contraseña')
		.trim()
		.escape()
		.isLength({ min: 8, max: 16 })
		.withMessage('La contraseña debe ser de 8 a 16 carácteres'),
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
