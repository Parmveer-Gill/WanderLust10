if(process.env.NODE_ENV != "production"){//maltab production phase ch credentials access nhi hone chahide , thats what we want---apne credentials privately safe rehn apne kol
    require("dotenv").config();//library used to access .env credentials , as we cant access env directly in backend

}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const review = require("./models/review.js");


const dbUrl= process.env.ATLASDB_URL;


main()
    .then(function () {
        console.log("CONNECTED TO DB")
    })
    .catch(function (err) {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));//to parse the requested data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//TO USE STATIC FILES
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
})
// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// })

//Read about below options from expresssjs docs
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //Below we are setting up expiration time of our cookie , it is 1 week time in milliseconds.
        //THIS EXPIRATION TIME will save the info(in form of cookie) of authenticated/logged user for 1 week ..just like we see in linkedIn or Github
        //Matlab is ease , user nu 1 week tkk dwara login krnn di llodd ni paini
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge : (7 * 24 * 60 * 60 * 1000),
        httpOnly : true,//for security purposes
    }
};



app.use(session(sessionOptions));//to make sure sessions are working , check for connect.sid (session id) ali cookie in application
app.use(flash());

//Passport ala code will be written after session middleware ,as we want that our user should only login once for a session
app.use(passport.initialize());
app.use(passport.session());
/*
authenticate() Generates a function that is used in Passport's LocalStrategy
serializeUser() Generates a function that is used by Passport to serialize(store) users into the session
deserializeUser() Generates a function that is used by Passport to deserialize users into the session
*/
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//Middleware for using local variable of flash---these locals can be accessed by any file of our PROJECT
app.use((req,res,next)=> {
    res.locals.success = req.flash("success");//here we will get "success" di value from routes->listing,js
    res.locals.error = req.flash("error");//here we will get "error" di value from routes->listing,js
    res.locals.currUser = req.user;
    next();
})



//THE BELOW LINE help us to use the all routes from listing.js form routes folder, we have written the common starting prefix as /listings as it is common in all routes of listing.js
//BY WRTING THIS COMMON /listing , there is no need to write /listing in routes folder again ,express will identify itself
app.use("/listings", listingRouter);

//Doing same with review ala 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//Creating Middleware to handle custom errors
app.use(function (err, req, res, next) {
    let { statusCode = 500, message } = err;
    res.status(statusCode).render("error.ejs", { message });

})
app.listen(8080, function () {
    console.log("Server is listening to port 8080")
})
