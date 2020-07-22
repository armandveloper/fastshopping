const { Router } = require('express');

const router = Router();

router.use(require('./auth.routes'));
router.use('/pedidos', require('./orders.routes'));

module.exports = router;
