const { Router } = require('express');
const {
	crearPedido,
	obtenerPedidos,
	obtenerPedido,
	eliminarPedido,
} = require('../controllers/orders.controller');

const router = Router();

router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedido);
router.post('/', crearPedido);
router.delete('/:id', eliminarPedido);

module.exports = router;
