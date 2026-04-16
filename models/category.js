const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
     categoryName: {
        type: String,
        required: true
    }
    
}, {timestamps: true})

const categoryModel = mongoose.model('category', categorySchema)

module.exports = categoryModel