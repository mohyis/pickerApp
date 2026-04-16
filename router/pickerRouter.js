const router = require('express').Router();
const passport = require('passport')
const { signUp, getUser, getAllUser, updateUser, deleteUser, resendOTP, verifyEmail, login } = require('../controller/pickerController');
router.post('/register', signUp)
router.get('/getUser/:id', getUser)
router.get('/getall', getAllUser)
router.put('/updateUser/:id', updateUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/resend', resendOTP)
router.post('/verify', verifyEmail)
router.post('/login', login)
router.get('/googleAuth', passport.authenticate("google", {scope: ["profile", "email"]}))
router.get('/googleLogin', passport.authenticate('google',{successRedirect: "/api/user/loginSuccess", failureRedirect: "/api/user/loginFail"}))

router.get('/loginSuccess', (req, res)=>{
    res.json({
        message: "login successful",
        data: req.user
    })
})

router.get('/loginFail', (req, res)=>{
    res.json({
        message: "login Failed"
    })
})


router.get('/facebookAuth', passport.authenticate("facebook"))
router.get('/facebookLogin', passport.authenticate('facebook', {successRedirect: "/api/user/fbLoginSuccess", failureRedirect: "/api/user/fbLoginFail"}))
router.get('/fbLoginSuccess', (req, res)=>{
    res.json({
        message: "login successful",
        data: req.user
    })
})

router.get('/fbLoginFail', (req, res)=>{
    res.json({
        message: "login Failed"
    })
})


router.get('/githubAuth', passport.authenticate("github"))
router.get('/githubLogin', passport.authenticate('github', {successRedirect: "/api/user/ghLoginSuccess", failureRedirect: "/api/user/ghLoginFail"}))
router.get('/ghLoginSuccess', (req, res)=>{
    res.json({
        message: "login successful",
        data: req.user
    })
})

router.get('/ghLoginFail', (req, res)=>{
    res.json({
        message: "login Failed"
    })
})



module.exports = router