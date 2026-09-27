const listing = require("../models/listing.js");
const review = require("../models/review.js");
// const asyncwrap = require("../utils/asyncwrap.js");
// const cstmerr = require("../utils/cstmerr.js");

module.exports.createReview = async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    Listing.reviews.push(newreview);
    await newreview.save();
    await Listing.save();
    req.flash("success", `New Review!!`);
    res.redirect(`/listings/${req.params.id}`);
    // console.log(newreview);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("done", `Review Deleted!!`);
    res.redirect(`/listings/${id}`);
}

