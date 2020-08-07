const { body, validationResult } = require('express-validator');

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
			req.flash('feedbackError', errores2);
			req.flash('repartidor', {
				...req.body,
			});
			return res.redirect('/admin/registrar-repartidor');
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
exports.validarActualizacion = [
	body('idRepartidor')
		.toInt()
		.isInt()
		.withMessage('Error al procesar los datos'),
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
	body('telefono')
		.isMobilePhone('es-MX')
		.withMessage('El teléfono no es válido'),
	(req, res, next) => {
		const errores = validationResult(req);
		let errores2 = errores.array().map((error) => error.msg);
		let passwordValida = true;
		if (req.body.password) {
			passwordValida =
				req.body.password.length >= 8 && req.body.password.length <= 16;
		}
		if (!passwordValida) {
			errores2.push('La contraseña debe ser de 8 a 16 carácteres');
		}
		if (errores2.length > 0) {
			req.flash('feedbackError', errores2);
			let redireccion = req.body.idRepartidor
				? `/admin/plantilla-repartidores/${req.body.idRepartidor}`
				: '/admin/plantilla-repartidores';
			return res.redirect(redireccion);
		}
		next();
	},
];

exports.validarId = [
	body('id').toInt().isInt().withMessage('Error al procesar los datos'),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			return res.json({ ok: false });
		}
		next();
	},
];
