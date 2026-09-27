const User = require("../models/user.js");
// const asyncwrap = require("../utils/asyncwrap.js");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");


module.exports.signupGet = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        //   console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Hello ${username} Welcome to Nookify!!`);
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginGet = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginPost = async (req, res) => {
    req.flash("success", "Welcome Home");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //done to prevent error 
    res.redirect(redirectUrl);
}

module.exports.logoutGet = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
}
