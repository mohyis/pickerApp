const pickerModel = require('../models/pickerModel');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator')
const {emailTemplate} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')



// const OTP = Math.floor(Math.random()* 1e4).toString().padEnd(4, `${Math.floor(Math.random()*10)}`)


exports.signUp = async(req,res)=>{
    try {
        
        const {name, email, country, phoneNumber, password} = req.body

        const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const emailExists = await pickerModel.findOne({ email: email})
        if (emailExists){
            return res.status(400).json({
                message: `${email} already exists`
            })
        }

        const signup = await pickerModel.create({
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
            message: 'user created',
            data
        })

        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.verifyEmail = async(req,res)=>{

    try {
        
        const { email, otp } = req.body;
        const user = await pickerModel.findOne({email})

        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        };
        if (new Date()> user.otpExpiresAt || user.otp != otp){
            return res.status(400).json({
                message: 'Invalid OTP'
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
        res.status(500).json({
            message: error.message
        })
    }
};

exports.resendOTP = async(req,res)=>{
    const { email } = req.body;
    const user = await pickerModel.findOne({email})

        if(!user){
            return res.status(404).json({
                message: 'user not found'
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

exports.login = async(req,res)=>{
    try {
        const {phoneNumber, password} = req.body
        const user  = await pickerModel.findOne({phoneNumber})
        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        };

        if(user.isVerified == false){
            return res.status(404).json({
                message: 'please verify your email'
            })

        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if(!passwordCorrect){
            return res.status(400).json({
                message: 'Invalid credentials'
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
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getAllUser = async(req,res)=>{
    try {
        const allUsers = await pickerModel.find()

        res.status(200).json({
            message: 'users found',
            allUsers
        })
    } catch (error) {
        res.status(500).json({
            message: error.messsage
        })
    }
};

exports.getUser = async(req,res)=>{
    try {
        const {id} = req.params
        
        const user = await pickerModel.findById(id)

        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        res.status(200).json({
            message: 'user found',
            user

        })
    } catch (error) {
        res.status(500).json({
            message: error.messsage
        })
    }
};

exports.updateUser = async(req,res)=>{
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
        const user = await pickerModel.findByIdAndUpdate(id, update, {new: true})

        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        res.status(200).json({
            message: 'user updated',
            user

            })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.deleteUser = async(req, res)=>{
    try {
         const {id} = req.params
        
        const user = await pickerModel.findByIdAndDelete(id)

        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        res.status(200).json({
            message: 'user deleted'

        })
    } catch (error) {
         res.status(500).json({
            message: error.message
        })
    }
};