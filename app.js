// http://localhost:3000/listings
// maam project repo - https://github.com/apna-college/wanderlust

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const mongoose = require("mongoose");

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const Joi = require("joi");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const path = require("path");
const { get } = require("http");

const listing = require("./models/listing.js");
const asyncwrap = require("./utils/asyncwrap.js");
const cstmerr = require("./utils/cstmerr.js");
const User = require("./models/user.js");

const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", engine);

app.use(express.static(path.join(__dirname, "public"))); //for using css and js file from default public name folder
app.set("view engine", "ejs"); //must to start working with ejs
app.set("views", path.join(__dirname, "/views")); //to access views when we are not inside the main folder or dir

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

/*Must Step to do before performing CRUD operation in Mong0*/
main()
  .then(() => {
    console.log("Connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60, // time (in seconds) to keep session data in cache
});
store.on("error", (err) => {
  console.log("Mongo Store Error", err);
});

// define sessions options
const sessionOptions = {
  store: store, // here we are telling our app to use mongo store
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.get("/", (req, res) => {
  res.redirect("/listings");
});


// use sessions
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //so har ek request ke liye hamara passport initialize hojayega
app.use(passport.session()); //ek session mai user ek hi baar sign up kare isiliye we add this

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.done = req.flash("done");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next(); //do not forget to call next otherwise you will be stuck at at this middleware only
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.get("/test", async (req, res) => {
//   let sample = new listing({
//     title: "",
//     description: "",
//     price: ,
//     location: "",
//     country: "India",
//   });
//   await sample.save();
//   res.send(sample);
// });

app.all("/{*splat}", (req, res, next) => {
  //do not write app.all("*", ___) or else path err would come
  next(new cstmerr(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Galat Hai Galat Hai!!!!!" } = err;
  // console.log(err);
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Listening");
});
