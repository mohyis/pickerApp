const { rateLimit } = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: 'too many request, please try again after 5mins'
})

module.exports = rateLimiter