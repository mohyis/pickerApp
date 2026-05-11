const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    lat: {
        type: String
    },
    long: {
        type: String
    },
    actualAddress: {
        type: String
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref : 'users'

    }

}, {timestamps: true})

const locationModel = mongoose.model('locations', locationSchema);

module.exports = locationModel

