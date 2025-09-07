const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")


//middle ware for validating Schema
module.exports.validateListing = function (req, res, next) {
    let { error } = listingSchema.validate(req.body);//it means we are checking that req.body is matching the all conditions of listingSchema in Joi or not
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }

}

//middle ware for validating review
module.exports.validateReview = function (req, res, next) {
    let { error } = reviewSchema.validate(req.body);//it means we are checking that req.body is matching the all conditions of listingSchema in Joi or not
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }

}
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {//it means when user is not logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login to Add a New Listing");
        return res.redirect("/login");//return ta layee k below ala code na chlae in case user is n't logged in 
    }
    next();//chlo agee bdoo awda
}
//req.isAuthenticated() is from passport


module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;//local ch value save krali 
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Check if listing exists
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Check if the logged-in user is the owner
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You Don't Have Permission To Modify This Listing");
        return res.redirect(`/listings/${id}`);
    }

    next(); // proceed if user is the owner
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId} = req.params;
    let review = await Review.findById(reviewId);

    // Check if the logged-in user is the owner
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You Don't Have Permission To Modify Someone's Review");
        return res.redirect(`/listings/${id}`);
    }

    next(); // proceed if user is the owner
};
