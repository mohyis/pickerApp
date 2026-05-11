const router = require('express').Router();
const multer = require('multer')
const upload = multer({dest: '/upload'})
const { verifyLogin, checkAdmin } = require('../middleware/validation')

const { signUpRestaurant, getRestaurant, getAllRestaurant, updateRestaurant, deleteRestaurant, resendRestaurantOTP, verifyRestaurantEmail, loginRestaurant, createCategory, deleteMenu, menuProduct, getAllMenu } = require('../controller/restaurantController');

router.post('/register', signUpRestaurant)
router.get('/getRestaurant/:id', getRestaurant)
router.get('/getallRestaurant', getAllRestaurant)
router.put('/updateRestaurant/:id', updateRestaurant)
router.delete('/deleteRestaurant/:id', deleteRestaurant)
router.post('/resend', resendRestaurantOTP)
router.post('/verify', verifyRestaurantEmail)
router.post('/login', loginRestaurant)

// router.post('/menu', verifyLogin, upload.single('image'), menuProduct)
router.post('/category', createCategory)
router.get('/menus', verifyLogin, getAllMenu)
router.delete('/menu/:id', checkAdmin, deleteMenu)

module.exports = router