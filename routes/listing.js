const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
//NOTE THAT HERE WE ARE PUTTING DOUBLE DOTS(..) ,AS WE ARE going from routes ali file to its relative parent directory
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require('multer')//it is used for handling mutli-part form data..i.e for uploading or passing file data
const {storage} = require("../cloudConfig.js")
const upload = multer({storage })//intialization of multer..storage means cloudinary di storage


//read aboot router.route from expressjs docs
//below apa "/" route di get and post request combine krti by using router.route 
router
    .route("/")
    .get(wrapAsync(listingController.index))//Creating our index route - named listings *** listingController.index is implemenation of Controllers from MVC, u can check file in controllers->listing.js

    .post(isLoggedIn, validateListing,upload.single("listing[image]"),
        wrapAsync(listingController.createListing));//Create Route
    

//***In some routes we have passes isLoggedIn is passed as a middlware that will verify that the current user is loggedin or not***
//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//below apa "/:id" route di get and post and delete request combine krti by using router.route 
router.
    route("/:id")
    .get(wrapAsync(listingController.showListing))//Show Route
    .put(isLoggedIn, isOwner, validateListing,upload.single("listing[image]"), wrapAsync(listingController.updateListing))//UPDATE ROUTE 
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));//DELETE ROUTE


//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))




module.exports = router;