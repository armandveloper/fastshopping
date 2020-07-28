const { checkSchema, validationResult } = require('express-validator');

const validacionId = {
	errorMessage: 'El id no es válido',
	isInt: true,
	toInt: true,
};

exports.validarPedido = [
	checkSchema({
		infoPedido: {
			in: ['body'],
			exists: {
				errorMessage: 'Debe ingresar la información del pedido',
			},
		},
		'infoPedido.idCliente': {
			errorMessage: 'El pedido es incorrecto',
			isInt: true,
			toInt: true,
		},
		articulos: {
			in: ['body'],
			isArray: {
				errorMessage: 'No ha agregado articulos',
				options: {
					min: 1,
				},
			},
		},
	}),
	(req, res, next) => {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			return res.status(400).json({
				ok: false,
				errores: errores.array().map((error) => error.msg),
			});
		}
		next();
	},
];

exports.validarId = [
	checkSchema({
		id: validacionId,
	}),
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

exports.validarActualizacion = [
	checkSchema({
		campoActualizar: {
			in: ['body'],
			trim: true,
			isEmpty: {
				errorMessage: 'Envíe el campo a actualizar',
				negated: true,
			},
		},
		idPedido: validacionId,
		importe: {
			in: ['body'],
			custom: {
				options: (valor, { req }) => {
					if (!req.body.campoActualizar) {
						return true;
					}
					if (req.body.campoActualizar === 'importe') {
						valor = Number(valor);
						if (valor === 0 || isNaN(valor)) {
							throw new Error('El importe no es un número');
						}
						if (valor < 0) {
							throw new Error(
								'El importe no puede ser menor de 0'
							);
						}
					}
					return true;
				},
			},
		},
	}),
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
