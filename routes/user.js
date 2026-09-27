const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncwrap = require("../utils/asyncwrap.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
  // signup ka get and post
  .get(userController.signupGet)
  .post(asyncwrap(userController.signupPost));

router.route("/login")
  // login ka get and post
  .get(userController.loginGet)
  .post(
    saveRedirectUrl,
    // passport.authenticate() is a middleware which authenticates the user
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginPost,
  );

router.route("/logout")
  .get(userController.logoutGet);

module.exports = router;
