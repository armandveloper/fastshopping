const { Router } = require('express');
const { estaAutenticado } = require('../helpers/auth');
const validacion = require('../validation/users');
const { createUser } = require('../controllers/users.controller');

const router = Router();

router.post('/', validacion.validarUsuario, createUser);
router.get('/perfil', estaAutenticado, (req, res) => {
	res.render('index', {
		titulo: 'Bienvenido',
	});
});

module.exports = router;
