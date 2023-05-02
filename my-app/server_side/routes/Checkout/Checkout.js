const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')

async function Checkout(req,res,db){
    const orderUpdates = req.body.cartItems; // assuming req.body is an array of objects
    let decoded;
    let userId;
    let token;

    // checks which token was passed in
    if (req.cookies.token) {
        token = req.cookies.token;
        try {
          decoded = jwt.verify(token, 'ahmedbob4');
        } catch (err) {
          // Handle JWT token decoding error
          return res.status(401).json({ error: 'Failed to decode token' });
        }
        userId = decoded.user_id;
      } else if (req.cookies.gToken) {
        token = req.cookies.gToken;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          // Handle JWT token decoding error
          return res.status(401).json({ error: 'Failed to decode token' });
        }
      } else {
        return res.status(401).json({ error: 'No token found' });
      }
    
    const fuser_id =  new ObjectId(userId) ; // get the user id if not guest token
  
    // add each cart item to the sales document
    for (const orderUpdate of orderUpdates) {
      const order_id = orderUpdate.order_id;
      const productId = orderUpdate.id;
      const quantity = orderUpdate.quantity;
      const product_id = new ObjectId(productId);
  
      // Get the product and check if there is enough quantity
      const product = await db.collection('products').findOne({ _id: product_id });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (product.productQuantity - orderUpdate.quantity < 0) {
        return res.status(500).json({ error: 'Insufficient product quantity' });
      }
      const new_quantity = product.productQuantity - orderUpdate.quantity;
  
      // Update the product quantity
      await db.collection('products').updateOne(
        { _id: product_id },
        { $set: { productQuantity: new_quantity } }
      ).catch(err=>{
        console.log(err.details)
      });

      // Insert the order into the sales collection
      const orderDocument = {
        product: product,
        quantityOrderd: orderUpdate.quantity_orderd,
        date: new Date(),
        totalOrderPrice: orderUpdate.totalPrice,
        status:'not delivered yet'
      };
      if(decoded.username) {
        orderDocument.guest_name = decoded.username;
      } else {
        orderDocument.user_id = fuser_id;
      }

      await db.collection('sales').insertOne(orderDocument).then(async ()=>{
        const orderId = new ObjectId(order_id)
        await db.collection('orders').deleteOne({_id: orderId}).then(()=>{
            console.log('Order deleted successfully')
        })
      }).catch(error => {
        return res.status(500).json({ error: `Server error : ${error}` });
      });
    }
  
    res.status(200).json({ message: 'Orders added to sales successfully' });
}

module.exports = Checkout