const { Router } = require('express');
const validacion = require('../validation/users');
const { createUser } = require('../controllers/users.controller');

const router = Router();

router.post('/', validacion.validarUsuario, createUser);

module.exports = router;
