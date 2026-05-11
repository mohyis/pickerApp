const menuModel = require('../models/menu')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const otpGen = require('otp-generator')
const reference = otpGen.generate(12, {digits: true, lowerCaseAlphabets: true,upperCaseAlphabets: true, specialChars: true})
const axios = require('axios')

exports.placeOrder = async(req, res)=>{
    try {
        const { id } = req.user;
        const { menuId } = req.params;
        const{ quantity } = req.body;

        const user = await userModel.findById(id)
        const menu = await menuModel.findById(menuId)

        if(!user){
            return next({
                message: 'user not found',
                statusCode: 404
            })
        }

        if(!menu){
            return next({
                message: 'menu not found',
                statusCode: 404
            })
        };

        const payload = {
            amount: menu.amount * quantity,
            customer: {
                email: user.email,
                name: user.name
            },
            redirect_url: 'http://localhost:8899/api/order',
            currency: 'NGN',
            reference: reference
        };
        

        const { data } = await axios.post(`https://api.korapay.com/merchant/api/v1/charges/initialize`,
            payload, {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_SK}`
                }
            }
        );

        const order = new orderModel({
            restaurantId: menu.restaurantId,
            userId: user._id,
            menuId: menu._id,
            quantity,
            total: menu.amount*quantity,
            reference: data.data.reference
        })

        await order.save();

        res.status(200).json({
            message: 'payment initialized successfully',
            data: data.data
        })

    } catch (error) {
       next({
        message: error.message, 
        statusCode: 500
      })
    }
}

exports.verifyPayment = async(req,res)=>{
    try {
        const { reference } = req.query
        const order = await orderModel.findOne({reference});

        if(!order){
            return next({
                message: 'no order found',
                statusCode: 404
            })
        }

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_SK}`
                }
            }
        )

        if(data.status === true && data.data.status === 'processing') {
            order.status = 'processing'

            await order.save();
            return res.status(200).json({
                message: 'payment is still processing'
            })
        }

        if(data.status === true && data.data.status === 'success') {
            order.status = 'successful'

            await order.save();
            return res.status(200).json({
                message: 'payment successful'
            })
        }

    } catch (error) {
        next({
        message: error.message, 
        statusCode: 500
      })
    }
}