const { Router } = require('express');
const { validarInicioSesion } = require('../validation/users');
const {
	mostrarLogin,
	mostrarRegistro,
	iniciarSesion,
	cerrarSesion,
} = require('../controllers/auth.controller');

const router = Router();

router.get('/registro', mostrarRegistro);
router.get('/login', mostrarLogin);
router.post('/signin', validarInicioSesion, iniciarSesion);
router.get('/logout', cerrarSesion);

module.exports = router;
