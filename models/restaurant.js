const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
     orderName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    otpExpiresAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        defaultValue: 'restaurant'
    }
}, {timestamps: true})

const restaurantModel = mongoose.model('restaurant', restaurantSchema)

module.exports = restaurantModel