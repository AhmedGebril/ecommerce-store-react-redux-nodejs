const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')

async function addOrder(req,res,db){

     // Extract the parameters from req.body
     const { productId, quantity } = req.body.order;
     // Verify and extract the user_id from the token in the cookie
     const token = req.cookies.token;
     const guest_token = req.cookies.gToken
     let decoded;
     let userId;
     let existingOrder; 

     if(token){
         try {
           decoded = jwt.verify(token, 'ahmedbob4');
           userId = decoded.user_id;
         } catch (err) {
           // Handle JWT token decoding error
           return res.status(401).json({ error: 'Failed to decode token' });
         }
     }else if(guest_token){
         try {

           decoded = jwt.verify(guest_token, 'ahmedbob4');
           userId = decoded;
           console.log(userId);
         } catch (err) {
           // Handle JWT token decoding error
           return res.status(401).json({ error: 'Failed to decode token' });
         }
     }
     const fuser_id = new ObjectId(decoded.user_id); 

     // Check if the product already exists in the orders collection for the given user
     if(userId.username){
      console.log('guest')
      existingOrder = await db.collection('orders').findOne({ guest_username: decoded.username, product: new ObjectId(productId) });
     }
     else if(userId.user_id){
      console.log('user')
      existingOrder = await db.collection('orders').findOne({ user: fuser_id, product: new ObjectId(productId) });
     }
     const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
   
     if(product.productQuantity < quantity){
         res.status(400).json({error:'the quantity is not available'})
     }
     else{
         if (existingOrder) {
             if(product.productQuantity < quantity){
                 res.status(400).json({error:'the quantity is not available'})
             }else{
                  // If the product already exists, update the quantity
                 await db.collection('orders').updateOne({ _id: existingOrder._id }, {  $inc: { quantity: parseInt(quantity) },$currentDate: { date: true } });
                 res.status(200).json({ message: 'Order quantity updated successfully' });
             }
         } else {
             let order
             if(guest_token){
                  order = {
                     product: new ObjectId(productId),
                     quantity: parseInt(quantity),
                     status:false,
                     totalPrice: parseInt(quantity) * parseInt(product.productPrice),
                     date: new Date(),
                     guest_username:decoded.username
                   };
             }
             else{
                  order = {
                     product: new ObjectId(productId),
                     quantity: parseInt(quantity),
                     user: fuser_id,
                     status:false,
                     totalPrice: parseInt(quantity) * parseInt(product.productPrice),
                     date: new Date()
                   };
             }
           // Insert order document
           await db.collection('orders').insertOne(order).then(OrderData => {
     
             // Send success response
             res.status(200).json({ message: 'Order created successfully' });
           }).catch(err => {
             console.error(err);
             // Send error response
             res.status(400).json({ error: 'Failed to create order' });
           });
         }
     }
}

module.exports = addOrder