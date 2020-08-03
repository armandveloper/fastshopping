const { Router } = require('express');
const {
	suscribir,
	obtenerClave,
} = require('../controllers/subscription.controller');

const router = Router();

router.get('/key', obtenerClave);
router.post('/subscribe', suscribir);

module.exports = router;
