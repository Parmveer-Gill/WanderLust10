const express = require("express");
const router = express.Router({mergeParams : true});//read about {mergeParams : true} in docs of expressjs
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


//POST ROUTE FOR REVIEWS
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview))

//DELETE ROUTE FOR REVIEWS
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))
module.exports = router;