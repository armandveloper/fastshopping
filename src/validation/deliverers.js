const { body, header, param, validationResult } = require('express-validator');

exports.validarRepartidor = [
	body('nombre')
		.not()
		.isEmpty()
		.withMessage('Ingrese el nombre')
		.trim()
		.escape(),
	body('apellido')
		.not()
		.isEmpty()
		.withMessage('Ingrese el apellido')
		.trim()
		.escape(),
	body('email')
		.isEmail()
		.withMessage('El email no es válido')
		.normalizeEmail(),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Ingrese la contraseña')
		.trim()
		.escape()
		.isLength({ min: 8, max: 16 })
		.withMessage('La contraseña debe ser de 8 a 16 carácteres'),
	body('telefono')
		.isMobilePhone('es-MX')
		.withMessage('El teléfono no es válido'),
	(req, res, next) => {
		const errores = validationResult(req);
		const errores2 = errores.array().map((error) => error.msg);
		if (!req.file) {
			errores2.push('Suba una imagen de perfil');
		}
		if (errores2.length > 0) {
			return res.json({ errores: errores2 });
			// req.flash(
			// 	'feedbackError',
			// 	errores.array().map((error) => error.msg)
			// );
			// req.flash('usuario', {
			// 	...req.body,
			// });
			// return res.redirect('/registro');
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
			return res.redirect('/repartidores/login');
		}
		next();
	},
];
