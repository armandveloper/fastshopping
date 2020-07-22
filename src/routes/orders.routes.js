const { Router } = require('express');
const { crearPedido } = require('../controllers/orders.controller');

const router = Router();

router.post('/', crearPedido);

module.exports = router;
