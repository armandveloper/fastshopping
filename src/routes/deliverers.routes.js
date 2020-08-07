const { Router } = require('express');
const { estaAutenticado, esRepartidor, esAdmin } = require('../helpers/auth');
const validacion = require('../validation/deliverers');
const {
	mostrarInicio,
	mostrarDetallesPedido,
	mostrarLogin,
	crearRepartidor,
	actualizarRepartidor,
	eliminarRepartidor,
	iniciarSesion,
	cerrarSesion,
} = require('../controllers/deliverers.controller');

const router = Router();

router.get('/', estaAutenticado, esRepartidor, mostrarInicio);
router.get(
	'/detalles/:id',
	estaAutenticado,
	esRepartidor,
	mostrarDetallesPedido
);
router.get('/login', mostrarLogin);
router.post(
	'/',
	estaAutenticado,
	esAdmin,
	validacion.validarRepartidor,
	crearRepartidor
);
router.post(
	'/actualizar',
	estaAutenticado,
	esAdmin,
	validacion.validarActualizacion,
	actualizarRepartidor
);
router.post('/signin', validacion.validarInicioSesion, iniciarSesion);
router.get('/logout', cerrarSesion);
router.delete(
	'/',
	estaAutenticado,
	esAdmin,
	validacion.validarId,
	eliminarRepartidor
);

module.exports = router;
