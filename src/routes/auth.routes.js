const { Router } = require('express');
const {
	mostrarLogin,
	mostrarRegistro,
} = require('../controllers/auth.controller');

const router = Router();

router.get('/registro', mostrarRegistro);
router.get('/login', mostrarLogin);

module.exports = router;
