const listing = require("../models/listing.js");
// const asyncwrap = require("../utils/asyncwrap.js");
// const cstmerr = require("../utils/cstmerr.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
// const review = require("../models/review.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.Map_Token;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let { category, destination } = req.query;
    let alllistings;

    if (destination) {
        // $or: ya toh location match kare ya country
        // $regex: word ka koi bhi hissa match karne ke liye (jaise 'york' se 'New York City' mil jaye)
        // $options: "i": case-insensitive search (capital aur small letter dono match honge)
        alllistings = await listing.find({
            $or: [
                { location: { $regex: destination, $options: "i" } },
                { country: { $regex: destination, $options: "i" } }
            ]
        });
    } else if (category && category.toLowerCase() !== "all") {
        alllistings = await listing.find({ category: category });
    } else {
        alllistings = await listing.find({});
    }

    res.render("listings/index.ejs", { alllistings });
};

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!Listing) {
        req.flash("error", `The Requested Listing Does Not Exist!!`);
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { Listing });
}

module.exports.createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();



    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, filename);
    // let { title, description, image, price, location, country } = req.body; //either write like this or more better way is to add all this under listing obj and extract it
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;

    newlisting.image = { url, filename };

    newlisting.geometry = response.body.features[0].geometry;

    let savedListing = await newlisting.save();
    console.log(savedListing);


    req.flash("success", `New Listing ${newlisting.title} Created!!`);
    res.redirect("/listings");
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let dellisting = await listing.findByIdAndDelete(id);
    console.log(dellisting);
    req.flash("done", `Listing ${dellisting.title} Deleted!!`);
    res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash("error", `The Requested Listing Does Not Exist!!`);
        return res.redirect("/listings");
    }

    let originalImage = Listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { Listing, originalImage });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename };
        await Listing.save();
    }

    req.flash("success", `Listing ${req.body.listing.title} updated!!`);
    res.redirect(`/listings/${id}`);
}

