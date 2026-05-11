const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
     menuName: {
        type: String,
        required: true
    },
    menuDescription: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    // categoryId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     require: true
    // },
    category: {
        type: String,
        require: true
    },
    isAvailable: {
        type: Boolean,
        defaultValue: true
    },
    menuImage: {
        type: String
    }
}, {timestamps: true})

const menuModel = mongoose.model('menu', menuSchema)

module.exports = menuModel