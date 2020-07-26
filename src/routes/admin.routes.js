const { Router } = require('express');
const { mostrarLoginAdmin } = require('../controllers/admin.controller');

const router = Router();

router.get('/', mostrarLoginAdmin);

module.exports = router;
