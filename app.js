const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
let PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

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

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not Found"))
// })

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message);
})

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})