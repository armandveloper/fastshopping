const { Router } = require('express');
const { estaAutenticado, esCliente } = require('../helpers/auth');
const validacion = require('../validation/users');
const {
	crearUsuario,
	obtenerUsuarioPorEmail,
	actualizarUsuario,
	actualizarAvatar,
	mostrarInicio,
	mostrarNotificaciones,
	mostrarHistorial,
	mostrarConfiguracion,
} = require('../controllers/users.controller');

const router = Router();

router.get('/', estaAutenticado, esCliente, mostrarInicio);
router.post('/', validacion.validarUsuario, crearUsuario);
router.post(
	'/actualizar',
	estaAutenticado,
	esCliente,
	validacion.validarActualizacion,
	actualizarUsuario
);
router.get('/configuracion', estaAutenticado, esCliente, mostrarConfiguracion);
router.put('/avatar', estaAutenticado, esCliente, actualizarAvatar);
router.get(
	'/notificaciones',
	estaAutenticado,
	esCliente,
	mostrarNotificaciones
);
router.get('/historial', estaAutenticado, esCliente, mostrarHistorial);
router.get(
	'/:email',
	estaAutenticado,
	esCliente,
	validacion.validarBusquedaUsuario,
	obtenerUsuarioPorEmail
);

module.exports = router;
