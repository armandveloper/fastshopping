const { Router } = require('express');
const { estaAutenticado } = require('../helpers/auth');
const { mostrarInicio } = require('../controllers/home.controllers');

const router = Router();

router.get('/', mostrarInicio);
router.use(require('./auth.routes'));
router.use('/usuarios', require('./users.routes'));
router.use('/pedidos', estaAutenticado, require('./orders.routes'));

module.exports = router;
