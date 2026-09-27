const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      // default:
      //   "https://images.unsplash.com/photo-1655492858187-707c19bf1961?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1655492858187-707c19bf1961?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v, //ternary operator used
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },
  price: Number,
  location: String,
  country: String,
  category: [
    {
      type: String,
      enum: [
        "Trending",
        "Amazing Pools",
        "Iconic Cities",
        "Rooms",
        "Cabins",
        "Camping",
        "Amazing Views",
        "Lakefront",
        "Castles",
        "Farms",
        "Food",
        "Arctic",
      ],
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"], //location.type must be Point to use GeoJson
      required: true
    },
    coordinates: {
      type: [Number],
      required: true //location.coordinates must be [longitude, latitude]
    }
  }
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } }); //this is used to delete all the reviews associated with the listing when the listing is deleted 
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
