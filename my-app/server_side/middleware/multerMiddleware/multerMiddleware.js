const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../client_side/public/images'); // the directory where the uploaded file will be saved
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // filename of the uploaded file
  }
});

const upload = multer({ storage: storage });

const multerMiddleware = (req, res, next) => {
  upload.single('productImage')(req, res, err => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image.' });
    }
    next();
  });
};

module.exports = multerMiddleware;