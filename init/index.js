const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Listing = require("../models/listing");
const initData = require("./data");

main().
then(() => {console.log("Connected to DB");}).
catch((err) => {console.log(err)})

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was  initialized");
}

initDB();