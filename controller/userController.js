const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator')
const {emailTemplate} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')



// const OTP = Math.floor(Math.random()* 1e4).toString().padEnd(4, `${Math.floor(Math.random()*10)}`)


exports.signUp = async(req,res,next)=>{
    try {
        
        const {name, email, country, phoneNumber, password} = req.body

        const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const emailExists = await userModel.findOne({ email: email})
        if (emailExists){
         return next({
            message: 'email already exists', 
            statusCode: 400
         })
        }

        const signup = await userModel.create({
            name, 
            email,
            country,
            phoneNumber: `+234${phoneNumber}`,
            otp: OTP,
            password: hashedPassword,
            otpExpiresAt: expiresAt
        })

        const emailOptions = {
            email: signup.email,
            subject: 'Welcome To Picker',
            html: emailTemplate(signup.name, OTP)
        }

        await sendMail(emailOptions);

        const data = {
            name: signup.name,
            email: signup.email,
            country: signup.country,
            phoneNumber: signup.phoneNumber
        }

        res.status(201).json({
            message: 'account created',
            data
        })

        
    } catch (error) {
      next({
        message: error.message, 
        statusCode: 500
      })
    }
};

exports.verifyEmail = async(req,res,next)=>{

    try {
        
        const { email, otp } = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return next({
        message: 'user not found',
        statusCode: 404
      })
        };
        if (new Date()> user.otpExpiresAt || user.otp != otp){
            return next({
                message: 'Invalid OTP',
                statusCode: 400
            })

        }

        user.isVerified = true
        user.otp = null
        user.otpExpiresAt = null

        await user.save()

        res.status(200).json({
            message: 'user verified successfully'
        })


    } catch (error) {
       next({
        message: error.message, 
        statusCode: 500
      })
    }
};

exports.resendOTP = async(req,res,next)=>{
    const { email } = req.body;
    const user = await userModel.findOne({email})

        if(!user){
          return next({
        message: 'user not found', 
        statusCode: 404
      })
        };

         const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);

        user.otp = OTP;
        user.otpExpiresAt = expiresAt

        const emailOptions = {
            email: user.email,
            subject: 'Confirm New OTP',
            html: emailTemplate(user.name, OTP)
        }

        await sendMail(emailOptions)

        await user.save()

        res.status(200).json({
            message: 'OTP sent successfully'
        })

};

exports.login = async(req,res, next)=>{
    try {
        const {email, password} = req.body
        const user  = await userModel.findOne({email})
        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        };

        if(user.isVerified == false){
            return next({
        message: 'please verify your email', 
        statusCode: 400
      })

        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if(!passwordCorrect){
            return next({
        message: 'invalid credentials', 
        statusCode: 400
      })
        }   

        const token = await jwt.sign({ 
            id: user._id, email: user.email}, 
            process.env.JWT_SECRET, 
            { expiresIn: '1 hour'})

        res.status(200).json({
            message: 'login successfully',
            token
        })


    } catch (error) {
        next(error)
    }
}


exports.getAllUser = async(req,res, next)=>{
    try {
        const allUsers = await userModel.find().select('-password')

        res.status(200).json({
            message: 'users found',
            allUsers
        })
    } catch (error) {
        next(error)
    }
};

exports.getUser = async(req,res, next)=>{
    try {
        const {id} = req.params
        
        const user = await userModel.findById(id).select('-password')

        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        }

        res.status(200).json({
            message: 'user found',
            user

        })
    } catch (error) {
        next(error)
    }
};

exports.updateUser = async(req,res, next)=>{
    try {
         const {id} = req.params
          const {name, email, country, phoneNumber, password} = req.body

         const update = {
            name, 
            email,
            country,
            phoneNumber,
            password
         }
        const user = await userModel.findByIdAndUpdate(id, update, {new: true})

        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        }

        res.status(200).json({
            message: 'user updated',
            user

            })
        
    } catch (error) {
       next(error)
    }
};

exports.deleteUser = async(req, res, next)=>{
    try {
         const {id} = req.params
        
        const user = await userModel.findByIdAndDelete(id)

        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        }

        res.status(200).json({
            message: 'user deleted'

        })
    } catch (error) {
         next(error)
    }
};