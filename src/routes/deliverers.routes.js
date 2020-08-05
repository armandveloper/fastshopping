const { Router } = require('express');
const {
	mostrarInicio,
	mostrarDetallesPedido,
} = require('../controllers/deliverers.controller');

const router = Router();

router.get('/', mostrarInicio);
router.get('/detalles/:id', mostrarDetallesPedido);

module.exports = router;
