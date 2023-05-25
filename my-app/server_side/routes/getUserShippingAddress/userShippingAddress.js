const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

async function getAddress(req, res, db) {
  const username = req.query.username;
  try {
    await db.collection('users').findOne({ username: username }).then((data) => {
      if (data) {
        return res.status(200).json({ 'ShippingDetails': data.shippingDetails });
      } else {
        return res.status(201).json({ message: 'guest user' });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = getAddress;
