const jwt = require('jsonwebtoken')

function guestToken(req,res){
    const username = req.query.username
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('gToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
    res.json({message:'token sent',username:username})
}

module.exports = guestToken