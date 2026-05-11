const router = require('express').Router();
const { userLocation } = require('../utils/location');

router.get('/location', userLocation)

module.exports = router