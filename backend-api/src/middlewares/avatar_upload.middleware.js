const multer = require('multer');
const path = require('path');
const ApiError = require('../api-error');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/');
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniquePrefix + path.extname(file.originalname));
    },
});

// Middleware for avatar upload
function avatarUpload(req, res, next) {
    const upload = multer({ storage: storage }).single('P_avatarFile');
    
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return next(
                new ApiError(400, 'An error occurred while uploading the avatar')
            );
        } else if (err) {
            return next(
                new ApiError(500, 'An unknown error occurred while uploading the avatar')
            );
        }
        // If everything is fine, proceed to the next middleware
        next();
    });
}

module.exports = avatarUpload;
