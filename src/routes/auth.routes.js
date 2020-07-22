const { Router } = require('express');
const { mostrarLogin } = require('../controllers/auth.controller');

const router = Router();

router.get('/login', mostrarLogin);

module.exports = router;
