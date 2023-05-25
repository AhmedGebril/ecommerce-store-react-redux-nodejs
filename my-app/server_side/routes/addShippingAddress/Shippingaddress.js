const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')

async function ShippingDetails(req,res,db){
    const shippingData = req.body
    let decoded
    if(req.cookies.gToken){
        return res.status(200).json(shippingData.formData)
    }
    else if(req.cookies.token){
        try{
            decoded = jwt.verify(req.cookies.token,process.env.JWT_SECRET)
        }catch{
            return res.status(401).json({ error: 'Failed to decode token' });
        }
    }
    const userId = new ObjectId(decoded.user_id)
    await db.collection('users').findOneAndUpdate(
        { _id: userId },
        { $push: { shippingDetails: shippingData.formData } }
      )
        .then((result) => {
          res.status(200).json('shipping adress added successfully');
        })
        .catch((error) => {
          console.error('Error adding shipping details:', error);
        });

        
}

module.exports = ShippingDetails