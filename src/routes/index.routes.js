const { Router } = require('express');
const { mostrarInicio } = require('../controllers/home.controllers');

const router = Router();

router.get('/', mostrarInicio);
router.use(require('./auth.routes'));
router.use('/pedidos', require('./orders.routes'));

module.exports = router;
