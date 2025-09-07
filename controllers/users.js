const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        //Till now user got signed up , not let make him auto logged in as per the correct flow of websites, it means the newly registered user will be auto. logged in
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.login =  async (req, res) => {
    req.flash("success", `WELCOME BACK ${req.user.username }, YOU ARE LOGGED IN SUCCESSFULLY`);
    let redirectUrl = res.locals.redirectUrl;
    if(redirectUrl){
        res.redirect(redirectUrl); 
    }
    else{
        res.redirect("/listings")
    }
   
}
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "LOGGED OUT SUCCESSFULLY!");
        res.redirect("/listings");
    })
}