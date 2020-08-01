const { body, header, param, validationResult } = require('express-validator');

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
			req.flash(
				'feedbackError',
				errores.array().map((error) => error.msg)
			);
			req.flash('usuario', {
				...req.body,
			});
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
exports.validarActualizacion = [
	body('idUsuario')
		.toInt()
		.isInt()
		.withMessage('Error al procesar los datos'),
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
	body('telefono')
		.isMobilePhone('es-MX')
		.withMessage('El teléfono no es válido'),
	body('codigoPostal')
		.isPostalCode('MX')
		.withMessage('El código postal no es válido'),
	body('colonia')
		.not()
		.isEmpty()
		.withMessage('Ingrese la colonia')
		.trim()
		.escape(),
	body('calle')
		.not()
		.isEmpty()
		.withMessage('Ingrese la calle')
		.trim()
		.escape(),
	body('numExt').toInt().isInt().withMessage('Ingrese su número exterior'),
	body('numInt').custom((valor) => {
		if (valor === '') {
			return true;
		}
		valor = Number(valor);
		if (valor < 1 || isNaN(valor)) {
			throw new Error('El número interior no es válido');
		}
		return true;
	}),
	body('referencias')
		.not()
		.isEmpty()
		.withMessage('Ingrese una referencia de ubicación')
		.trim()
		.escape(),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			req.flash(
				'feedbackError',
				errores.array().map((error) => error.msg)
			);
			return res.redirect('/usuarios/configuracion');
		}
		next();
	},
];
exports.validarBusquedaUsuario = [
	header('idUsuarioEmisor')
		.toInt()
		.isInt()
		.withMessage('Error al procesar los datos'),
	param('email')
		.isEmail()
		.withMessage('El email no es válido')
		.normalizeEmail(),
	(req, res, next) => {
		console.log(req.headers['id-usuario-emisor']);
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			return res.json({
				ok: false,
				mensaje: 'Datos incorrectos. Revise su búsqueda',
				errores: errores.array(),
			});
		}
		next();
	},
];
