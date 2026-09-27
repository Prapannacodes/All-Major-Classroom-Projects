const express = require("express");
const router = express.Router();


// ../ means entering into parent directory

const listing = require("../models/listing.js");
const asyncwrap = require("../utils/asyncwrap.js");
const cstmerr = require("../utils/cstmerr.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const listingController = require("../controllers/listing.js");

const multer = require('multer');
const { storage } = require('../CloudConfig');
const upload = multer({ storage: storage });


// router.route is used to group routes that have same path or url

router.route("/")
  // index route
  .get(asyncwrap(listingController.index))
  // create route
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, asyncwrap(listingController.createListing));

//add new route
router.get("/new", isLoggedIn, listingController.newForm);

router.route("/:id")
  // show route
  .get(asyncwrap(listingController.showListing))
  // update route
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, asyncwrap(listingController.updateListing))
  // delete route
  .delete(isLoggedIn, isOwner, asyncwrap(listingController.deleteListing));

router.route("/:id/edit")
  // edit route
  .get(isLoggedIn, isOwner, asyncwrap(listingController.editForm));



module.exports = router;
