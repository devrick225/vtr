const express = require('express')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only .doc and .pdf files are allowed.'));
        }
    },
});

const {uploadDoc, validateDoc, devalidateDoc
} = require("../controller/DocumentController")
const isAuthenticated = require("../middlewares/isAuthenticated");

const documentRouter = express.Router();

documentRouter.post('/:id/upload',upload.single('file'), isAuthenticated, uploadDoc);
documentRouter.post('/:id/validate', isAuthenticated, validateDoc);
documentRouter.post('/:id/invalidate', isAuthenticated, devalidateDoc);

module.exports = documentRouter
