const router = require('express').Router();
const { placeOrder, verifyPayment } = require('../controller/orderController');
const { verifyLogin } = require('../middleware/validation');


router.post('/order/:menuId', verifyLogin, placeOrder)
router.get('/order', verifyPayment)

module.exports = router