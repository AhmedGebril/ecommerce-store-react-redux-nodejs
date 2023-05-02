async function getProducts(req,res,db){
    db.collection('products').find({}).toArray().then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
        res.status(201)
    })
}

module.exports = getProducts