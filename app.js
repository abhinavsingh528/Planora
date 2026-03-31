const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
let PORT = process.env.PORT || 8080;
const Listing = require("./models/listing.js")
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().
then(() => {console.log("Connected to DB");}).
catch((err) => {console.log(err)});

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

//Root Route
app.get("/", (req, res) => {
    res.send("Hii... I'm Root")
})

// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
})

// New Route
app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs")
})

// Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("listings")
})

// Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
})

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
})

// Update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Gao",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})