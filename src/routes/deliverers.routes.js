const { Router } = require('express');
const { estaAutenticado, esRepartidor } = require('../helpers/auth');
const validacion = require('../validation/deliverers');
const {
	mostrarInicio,
	mostrarDetallesPedido,
	mostrarLogin,
	crearRepartidor,
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
router.post('/', validacion.validarRepartidor, crearRepartidor);
router.post('/signin', validacion.validarInicioSesion, iniciarSesion);
router.get('/logout', cerrarSesion);

module.exports = router;
