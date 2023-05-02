const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

async function checkAdminToken(req,res,db){
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = new ObjectId(decoded.user_id)
      const user = await db.collection('users').findOne({_id:userId})
      if (user.username == process.env.ADMIN_USERNAME){
          res.status(200).json({ message: 'success'})
      }
      else{
          return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
}

module.exports = checkAdminToken