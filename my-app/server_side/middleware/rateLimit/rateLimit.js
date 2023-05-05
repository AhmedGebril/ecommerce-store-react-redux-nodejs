const rateLimit = require('express-rate-limit')

function getRateLimit(req, res, next) {
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, 
    message: 'Too many requests from this IP, please try again later',
  })
  console.log('here')
  limiter(req, res, next)
}

module.exports = getRateLimit