const restaurantModel = require('../models/restaurant');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator')
const cloudinary = require('cloudinary')
const menuModel = require("../models/menu")
const {emailTemplate} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken');
const categoryModel = require('../models/category');



// const OTP = Math.floor(Math.random()* 1e4).toString().padEnd(4, `${Math.floor(Math.random()*10)}`)


exports.signUpRestaurant = async(req,res)=>{
    try {
        
        const {name, email, country, phoneNumber, password} = req.body

        const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const emailExists = await restaurantModel.findOne({ email: email})
        if (emailExists){
            return res.status(400).json({
                message: `${email} already exists`
            })
        }

        const signup = new restaurantModel({
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
        await signup.save()

        const data = {
            name: signup.name,
            email: signup.email,
            country: signup.country,
            phoneNumber: signup.phoneNumber
        }

        res.status(201).json({
            message: 'restaurant created',
            data
        })

        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.verifyRestaurantEmail = async(req,res)=>{

    try {
        
        const { email, otp } = req.body;
        const restaurant = await restaurantModel.findOne({email})

        if(!restaurant){
            return res.status(404).json({
                message: 'restaurant not found'
            })
        };
        if (new Date()> restaurant.otpExpiresAt || restaurant.otp != otp){
            return res.status(400).json({
                message: 'Invalid OTP'
            })

        }

        restaurant.isVerified = true
        restaurant.otp = null
        restaurant.otpExpiresAt = null

        await restaurant.save()

        res.status(200).json({
            message: 'restaurant verified successfully'
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.resendRestaurantOTP = async(req,res)=>{
    const { email } = req.body;
    const restaurant = await restaurantModel.findOne({email})

        if(!restaurant){
            return res.status(404).json({
                message: 'restaurant not found'
            })
        };

         const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);

        restaurant.otp = OTP;
        restaurant.otpExpiresAt = expiresAt

        const emailOptions = {
            email: restaurant.email,
            subject: 'Confirm New OTP',
            html: emailTemplate(restaurant.name, OTP)
        }

        await sendMail(emailOptions)

        await restaurant.save()

        res.status(200).json({
            message: 'OTP sent successfully'
        })

};

exports.loginRestaurant = async(req,res)=>{
    try {
        const {phoneNumber, password} = req.body
        const restaurant  = await restaurantModel.findOne({phoneNumber})
        if(!restaurant){
            return res.status(404).json({
                message: 'restaurant not found'
            })
        };

        if(restaurant.isVerified == false){
            return res.status(404).json({
                message: 'please verify your email'
            })

        }

        const passwordCorrect = await bcrypt.compare(password, restaurant.password)
        if(!passwordCorrect){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }   

        const token = await jwt.sign({ 
            id: restaurant._id}, 
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


exports.getAllRestaurant = async(req,res)=>{
    try {
        const allrestaurants = await restaurantModel.find()

        res.status(200).json({
            message: 'restaurants found',
            allrestaurants
        })
    } catch (error) {
        res.status(500).json({
            message: error.messsage
        })
    }
};

exports.getRestaurant = async(req,res)=>{
    try {
        const {id} = req.params
        
        const restaurant = await restaurantModel.findById(id)

        if(!restaurant){
            return res.status(404).json({
                message: 'restaurant not found'
            })
        }

        res.status(200).json({
            message: 'restaurant found',
            restaurant

        })
    } catch (error) {
        res.status(500).json({
            message: error.messsage
        })
    }
};

exports.updateRestaurant = async(req,res)=>{
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
        const restaurant = await restaurantModel.findByIdAndUpdate(id, update, {new: true})

        if(!restaurant){
            return res.status(404).json({
                message: 'restaurant not found'
            })
        }

        res.status(200).json({
            message: 'restaurant updated',
            restaurant

            })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.deleteRestaurant = async(req, res)=>{
    try {
         const {id} = req.params
        
        const restaurant = await restaurantModel.findByIdAndDelete(id)

        if(!restaurant){
            return res.status(404).json({
                message: 'restaurant not found'
            })
        }

        res.status(200).json({
            message: 'restaurant deleted'

        })
    } catch (error) {
         res.status(500).json({
            message: error.message
        })
    }
};

exports.menuProduct = async(req,res)=>{
    try {
        const {id} = req.user
        const { categoryId, menuName, menuDescription, amount } = req.body
        cloudinary.config({
            cloud_name: process.env.API_CLOUDNAME,
            api_secret: process.env.API_SECRET,
            api_key: process.env.API_KEY
        })

        console.log(req.file);
        
        const uploadCloud = await cloudinary.uploader.upload(req.file.path)
        if(!req.file.path){
            return res.status(404).json({
                message: 'file not found'
            })
        }

       
        const product = menuModel({
            restaurantId: id,
            categoryId, 
            menuName, 
            menuDescription, 
            amount,
            menuImage: uploadCloud.secure_url
           
        })

        await product.save()

        console.log(product)

        res.status(201).json({
            message: 'menu created successfully',
            product
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.createCategory = async(req, res)=>{
    try {
        const{ categoryName } = req.body

        const category = await categoryModel.create({
            categoryName
        })

        res.status(201).json({
            message: 'category created successfully',
            category
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.deleteMenu = async(req, res)=>{
    try {

        const {id} = req.params

        const menu = await menuModel.findByIdAndDelete(id)
        if(!menu){
            return res.status(404).json({
                message: 'menu not found'
            })
        }

        res.status(200).json({
            message: 'menu deleted successfully'
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}