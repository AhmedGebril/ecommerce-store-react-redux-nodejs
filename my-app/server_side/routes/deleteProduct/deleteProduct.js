const fs = require('fs');
const { ObjectId } = require('mongodb');

async function deleteProduct(req,res,db){
const id = req.params.id;
const object = new ObjectId(id);
try {
    const data = await db.collection('products').findOne({ _id: object });
    console.log(data);
    if (data) {
        // Extract image file path from product data
        const imagePath = './'+data.productImage;

        // Delete product image file from images folder
        fs.unlink(imagePath, (err) => {
            if (err) {
                res.status(500).json('eternal error Please report the error image not found')
            }
        });

        // Delete product from MongoDB
        await db.collection('products').deleteOne({ _id: object });
        res.status(200).send(); // Product deleted successfully
    } else {
        res.status(500).json('product not found !'); // Product not found
    }
} catch (err) {
    res.status(500).json('eternal error Please report the error'); // Error occurred during deletion
}
}

module.exports = deleteProduct