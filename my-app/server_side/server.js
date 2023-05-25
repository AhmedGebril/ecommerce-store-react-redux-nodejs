const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {ConnectDb,getDb}=require('./DB')
const { ObjectId } = require('mongodb');
const https = require('https');
const Register = require('./routes/Register/Register')
const Login = require('./routes/Login/Login')
const guestToken = require('./routes/guestToken/guestToken')
const checkAdminToken = require('./routes/checkAdminToken/checkAdminToken')
const getProducts = require('./routes/getProducts/getProducts')
const multerMiddleware = require('./middleware/multerMiddleware/multerMiddleware')
const deleteProduct = require('./routes/deleteProduct/deleteProduct')
const addOrder = require('./routes/addOrder/addOrder')
const getUserOrders = require('./routes/getUserOrders/getUserOrders')
const Checkout = require('./routes/Checkout/Checkout')
const cookieParser = require('cookie-parser');
const limiter = require('./middleware/rateLimit/rateLimit')
const ShippingDetails = require('./routes/addShippingAddress/Shippingaddress')
const getUserShippingAddress = require('./routes/getUserShippingAddress/userShippingAddress')
require('dotenv').config()

app.use(express.json())
app.use(limiter)
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin:'http://localhost:3000',credentials:true}))
app.options('*', cors({ origin: 'http://localhost:3000', credentials: true }));
let db
let token




ConnectDb((err) => {
    if (!err) {
    app.listen(3001, () => {
        console.log('Listening server on port 3001')
    })
    db = getDb()
    }
})

// Register
app.post('/Register', (req, res) => {
   Register(req, res,db)

})
// sign in
app.post('/Signin',(req,res)=>{
    Login(req,res,db)
})

app.get('/generate-token', (req, res) => {
   guestToken(req,res)
  });

app.get('/api/check-token',(req,res)=>{
  checkAdminToken(req,res,db)
})

// add function update cart
// app.post('/UpdateCart',(req,res)=>{
//     const{username,count}=req.body
//     db.collection('users').updateOne(
//         { username: username },
//         { $push: { orders: count } }
//     ).then(data=>{
//         res.status(200).json(data)
//     })
// })




// add products
app.post('/addProduct',multerMiddleware,async (req, res)=>{
    await db.collection('products').insertOne({productImage:`${req.file.path}`,
    productName:req.body.productName,productQuantity:Number(req.body.productQuantity),productPrice:parseFloat(req.body.productPrice),
    description:req.body.Description,category:req.body.Category,brand:req.body.Brand,}).then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        res.status(500).json({error:'error uploading the data please check the right data fields'});
        console.log(err.errInfo.details.schemaRulesNotSatisfied)
    })
})

// Get all products
app.get('/getProducts',(req,res)=>{
   getProducts(req,res,db)
})

// Delete products
app.delete(`/products/:id`, async (req, res) => {
   deleteProduct(req,res,db)
});


//  Add the product to the order document
app.post('/addOrder', async (req, res) => {
    addOrder(req,res,db)
  });
  
// Get User Orders
app.get('/orders/user', async (req, res) => {
   getUserOrders(req,res,db)
  });

  app.put('/checkout/products', async (req, res) => {
  Checkout(req,res,db)
});


app.get('/Product', async (req, res) => {
    const id = req.query.id;
    const object = new ObjectId(id);
    await db.collection('products').findOne({ _id: object }).then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json('eternal error Please report the error')
    })
})

app.get('/logout', (req, res) =>{
    res.status(200).clearCookie('token').json({data:'done'})
  });

// still needs to be implemented in the frontend
app.delete('/delete/orderItem', async (req, res) =>{
    const order_id = req.body.id
    const orderId = new ObjectId(order_id)
    await db.collection('orders').deleteOne({ _id:orderId}).then(()=>{
        res.status(200).json({message:'item removed successfully'})
    }).catch(err =>{
        res.status(500).json(err)
    })
})

// handles adding the  shipping  address to the user  
app.post('/save/ShippingDetails',async (req, res) =>{
    ShippingDetails(req,res,db)
})

app.get('/getUserShippingAddress',async (req,res)=>{
    getUserShippingAddress(req,res,db)
})