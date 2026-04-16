const router = require('express').Router();
const multer = require('multer')
const upload = multer({dest: '/upload'})
const { verifyLogin, checkAdmin } = require('../middleware/validation')

const { signUpRestaurant, getRestaurant, getAllRestaurant, updateRestaurant, deleteRestaurant, resendRestaurantOTP, verifyRestaurantEmail, loginRestaurant, createCategory, deleteMenu, menuProduct } = require('../controller/restaurantController');
const categoryModel = require('../models/category');
router.post('/register', signUpRestaurant)
router.get('/getRestaurant/:id', getRestaurant)
router.get('/getallRestaurant', getAllRestaurant)
router.put('/updateRestaurant/:id', updateRestaurant)
router.delete('/deleteRestaurant/:id', deleteRestaurant)
router.post('/resend', resendRestaurantOTP)
router.post('/verify', verifyRestaurantEmail)
router.post('/login', loginRestaurant)

router.post('/order', verifyLogin, upload.single('image'), menuProduct)
router.post('/category', createCategory)
router.delete('/orders/:id', checkAdmin, deleteMenu)

module.exports = router