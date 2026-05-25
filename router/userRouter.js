const router = require('express').Router();
const passport = require('passport')
const { signUp, getUser, getAllUser, updateUser, deleteUser, resendOTP, verifyEmail, login, logout } = require('../controller/userController');
const rateLimiter = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: user management and authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The User Id
 *           example: 787674563782983746578439
 *         name:
 *           type: string
 *           description: The User's name
 *           example: john doe
 *         email:
 *           type: string
 *           description: The User's email
 *           example: example@example.com
 *         country:
 *           type: string
 *           description: The User's country
 *           example: malaysia
 *         phoneNumber:
 *           type: string
 *           description: The User phone number
 *           example: +2348029837465
 *         password:
 *           type: string
 *           description: The User's password
 *           example: password123
 *         isVerified:
 *           type: boolean
 *           description: The User verification status
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The User creation date
 *           example: 2026-05-04
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The User update time
 *           example: 2026-05-04
 */



/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: User registration
 *     description: Register a new user with email, password and other details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: john doe
 *               email:
 *                 type: string
 *                 description: The User's email
 *                 example: example@example.com
 *               country:
 *                 type: string
 *                 description: The User's country
 *                 example: malaysia
 *               phoneNumber:
 *                 type: string
 *                 description: The User phone number
 *                 example: +2348029837465
 *               password:
 *                 type: string
 *                 description: The User's password
 *                 example: password123
 *     responses:
 *       201:
 *         description: user registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: a success message
 *                   example: user reg successfully
 */
router.post('/register', signUp)

/**
 * @swagger
 * /api/v1/user/getUser/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: A User
 *     description: Get one user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The User Id
 *         schema:
 *           type: string
 *           example: 875674563782983746578439
 *     responses:
 *       200:
 *         description: display user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                   
 * 
 */
router.get('/getUser/:id', getUser)

/**
 * @swagger
 * /api/v1/user/getall:
 *   get:
 *     tags:
 *       - User
 *     summary: All User
 *     description: Get all user
 *     responses:
 *       200:
 *         description: list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The User Id
 *                         example: 787674563782983746578439
 *                       firstName:
 *                         type: string
 *                         description: The User first name
 *                         example: john
 *                       lastName:
 *                         type: string
 *                         description: The User last name
 *                         example: doe
 *                       email:
 *                         type: string
 *                         description: The User email
 *                         example: example@example.com
 *                       phoneNumber:
 *                         type: string
 *                         description: The User phone number
 *                         example: +2348029837465
 *                       isVerified:
 *                         type: boolean
 *                         description: The User verification status
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User creation date
 *                         example: 2026-05-04
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User update time
 *                         example: 2026-05-04
 * 
 */
router.get('/getall', getAllUser)
router.put('/updateUser/:id', updateUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/resend', resendOTP)
router.post('/verify', verifyEmail)

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User Login
 *     description: Users log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The User's email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: The User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: user login interface
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: a success message
 *                   example: user login successfully
 */
router.post('/login', rateLimiter ,login)
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

router.post('/logout', logout)

module.exports = router