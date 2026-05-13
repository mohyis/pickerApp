const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
        ENUM: ['user','admin'],
        default: 'user'
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    }
}, {timestamps: true})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel