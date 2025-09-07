const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/users.js");
const { route } = require("./listing.js");

router.route("/signup")
    .get(userController.renderSignUpForm)//GET REQUEST for signup page
    .post(wrapAsync(userController.signup))//POST REQUEST for signup page


router.route("/login")
.get( userController.renderLoginForm)//GET REQUEST for login page
.post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);//POST REQUEST for login page

//here passport.authenticate will entirely self manage whether the user loggining in is new or already registered user,below passport.authenticate is passes as a middleware
// userController.login actually here means what we are going to do after loggin in , i.e post login kmm



//LOG OUT ALA ROUTE
// req.logout id also from passport that handle user logout process all by self
router.get("/logout", userController.logout)

module.exports = router;