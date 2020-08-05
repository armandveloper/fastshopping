const { Router } = require('express');
const {
	descartarNotificacion,
} = require('../controllers/notifications.controller');

const router = Router();

router.put('/:id', descartarNotificacion);

module.exports = router;
