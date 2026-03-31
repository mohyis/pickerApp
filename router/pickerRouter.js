const router = require('express').Router();
const { signUp, getUser, getAllUser, updateUser, deleteUser, resendOTP, verifyEmail, login } = require('../controller/pickerController');
router.post('/register', signUp)
router.get('/getUser/:id', getUser)
router.get('/getall', getAllUser)
router.put('/updateUser/:id', updateUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/resend', resendOTP)
router.post('/verify', verifyEmail)
router.post('/login', login)



module.exports = router