const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
let PORT = process.env.PORT || 8080;
const Listing = require("./models/listing.js")
const mongoose = require("mongoose");

main().
then(() => {console.log("Connected to DB");}).
catch((err) => {console.log(err)})

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

//Root Route
app.get("/", (req, res) => {
    res.send("Hii... I'm Root")
})

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Gao",
        country: "India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
})

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})