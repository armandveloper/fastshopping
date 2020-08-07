const { body, validationResult } = require('express-validator');

exports.validarAdmin = [
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
			return res.redirect('/admin/configuracion');
		}
		next();
	},
];
