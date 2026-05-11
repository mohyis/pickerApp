const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurants'
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menus'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
     status: {
        type: String,
        enum: ['pending', 'successful', 'processing']
    },
    total: {
        type: String
    },
    quantity: {
        type: Number
    },
    reference: {
        type: String,
        required: true

    }
}, {timestamps: true})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel