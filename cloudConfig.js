const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({//cloud ali storage aha apni , sauuu lage GAPP ni marda parteek
    cloudinary: cloudinary,
    //below ale kmm sare cloudinary de utte hon ge
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
    },
});
module.exports = {
    cloudinary, storage
}