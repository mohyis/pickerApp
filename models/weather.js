const mongoose = require('mongoose')


const weatherSchema = new mongoose.Schema({
    lat: {
        type: String
    },
    lon: {
        type: String
    },
    temp: {
        type: String
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref : 'users'
    }


}, {timestamps: true})

const weatherModel = mongoose.model('weather', weatherSchema)

module.exports = weatherModel