const { Router } = require('express');
const { estaAutenticado, esAdmin } = require('../helpers/auth');
const validacion = require('../validation/admin');
const {
	mostrarInicio,
	mostrarRegistroRepartidor,
	mostrarLogin,
	mostrarConfiguracion,
	mostrarRepartidores,
	mostrarRepartidor,
	iniciarSesion,
	cerrarSesion,
	crearAdmin,
	actualizarAdmin,
} = require('../controllers/admin.controller');

const router = Router();

router.get('/', estaAutenticado, esAdmin, mostrarInicio);
router.get('/login', mostrarLogin);
router.post('/signin', iniciarSesion);
router.get('/logout', cerrarSesion);
router.get(
	'/registrar-repartidor',
	estaAutenticado,
	esAdmin,
	mostrarRegistroRepartidor
);
router.post('/', estaAutenticado, esAdmin, crearAdmin);
router.get('/configuracion', estaAutenticado, esAdmin, mostrarConfiguracion);
router.post(
	'/actualizar',
	estaAutenticado,
	esAdmin,
	validacion.validarAdmin,
	actualizarAdmin
);
router.get(
	'/plantilla-repartidores',
	estaAutenticado,
	esAdmin,
	mostrarRepartidores
);
router.get(
	'/plantilla-repartidores/:id',
	estaAutenticado,
	esAdmin,
	mostrarRepartidor
);

module.exports = router;
