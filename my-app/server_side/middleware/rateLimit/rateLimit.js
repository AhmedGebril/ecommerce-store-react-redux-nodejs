const rateLimit = require('express-rate-limit')

  function getRateLimit(){
    rateLimit = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100, 
      message: 'Too many requests from this IP, please try again later',
    })
  }
  
  module.exports=getRateLimit

  
