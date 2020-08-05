const { Router } = require('express');
const { mostrarInicio } = require('../controllers/admin.controller');

const router = Router();

router.get('/', mostrarInicio);

module.exports = router;
