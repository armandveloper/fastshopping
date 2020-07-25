const { Router } = require('express');
const validacion = require('../validation/orders');
const {
	crearPedido,
	obtenerPedidos,
	obtenerPedido,
	actualizarPedido,
	eliminarPedido,
} = require('../controllers/orders.controller');

const router = Router();

router.get('/', obtenerPedidos);
router.get('/:id', validacion.validarId, obtenerPedido);
router.post('/', validacion.validarPedido, crearPedido);
router.put('/', validacion.validarActualizacion, actualizarPedido);
router.delete('/:id', validacion.validarId, eliminarPedido);

module.exports = router;
