const { Router } = require('express');
const { mostrarInicio } = require('../controllers/deliverers.controller');

const router = Router();

router.get('/', mostrarInicio);

module.exports = router;
