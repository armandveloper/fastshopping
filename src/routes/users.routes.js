const { Router } = require('express');
const { estaAutenticado } = require('../helpers/auth');
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

router.get('/', estaAutenticado, mostrarInicio);
router.post('/', validacion.validarUsuario, crearUsuario);
router.post('/actualizar', validacion.validarActualizacion, actualizarUsuario);
router.get('/configuracion', estaAutenticado, mostrarConfiguracion);
router.put('/avatar', estaAutenticado, actualizarAvatar);
router.get('/notificaciones', estaAutenticado, mostrarNotificaciones);
router.get('/historial', estaAutenticado, mostrarHistorial);
router.get(
	'/:email',
	estaAutenticado,
	validacion.validarBusquedaUsuario,
	obtenerUsuarioPorEmail
);

module.exports = router;
