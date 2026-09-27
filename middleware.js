const listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const cstmerr = require("./utils/cstmerr.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to add your Listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if (!Listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", `Access Denied!!`);
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new cstmerr(400, errmsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new cstmerr(400, errmsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = (req, res, next) => {
    let { id, reviewId } = req.params;
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = `/listings/${id}`;
        req.flash("error", "Login to add your Review!");
        return res.redirect("/login");
    }
    next();
}


