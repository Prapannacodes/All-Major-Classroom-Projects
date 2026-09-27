const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");


main()
  .then(() => {
    console.log("Connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Nookify");
}

const initdb = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '6ab121c7cb9efb629e9179cc' })); //map creates a new array by applying a function to each element of the original array thus we are storing first in initdata.data and then inserting it in the db
  await listing.insertMany(initdata.data);
  console.log("data was inited");
};

initdb();
