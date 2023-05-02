const {ObjectId} = require('mongodb')
const jwt  = require('jsonwebtoken')

async function getUserOrders (req,res,db){
    let token;
    let decoded;
    let userId;
  
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
  
    const fuser_id = new ObjectId(userId); // Correct usage of ObjectId
    let orders;
    if (decoded.username) {
      // Query orders by guest_username
      orders = await db.collection('orders').find({ guest_username: decoded.username }).toArray();
    } else {
      // Query orders by user ID
      orders = await db.collection('orders').find({ user: fuser_id }).toArray();
    }
    // Extract the product IDs from the orders
    const productIds = orders.map((order) => order.product);
  
    // Fetch products from the products collection using the extracted product IDs
    const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();
  
    // Combine the orders and products to generate the final result
    const result = orders.map((order) => {
      const product = products.find((product) => product._id.toString() === order.product.toString());
      return {
        order_id: order._id,
        quantity_orderd: order.quantity,
        product_price: product.productPrice,
        product_description: product.description,
        product_name: product.productName,
        totalPrice: order.totalPrice,
        id: product._id,
      };
    });
    res.status(200).json(result);
}

module.exports = getUserOrders