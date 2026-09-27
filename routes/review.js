const express = require("express");
const router = express.Router({ mergeParams: true });
const { saveRedirectUrl } = require("../middleware.js");

// ../ means entering into parent directory

const listing = require("../models/listing.js");
const asyncwrap = require("../utils/asyncwrap.js");
const cstmerr = require("../utils/cstmerr.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const { validateReview, isReviewAuthor } = require("../middleware.js");
// const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//review ka postroute
router.post(
  "/",
  isReviewAuthor,
  validateReview,
  asyncwrap(reviewController.createReview),
);

//review ka deleteroute
router.delete(
  "/:reviewId",
  isReviewAuthor,
  asyncwrap(reviewController.deleteReview),
);

module.exports = router;
