const mongoose = require('mongoose')

const pickerSchema = new mongoose.Schema({
     name: {
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
    }
}, {timestamps: true})

const pickerModel = mongoose.model('picker', pickerSchema)

module.exports = pickerModel