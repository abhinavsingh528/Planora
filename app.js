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
const session = require("express-session")
const flash = require("connect-flash")

main().
then(() => {console.log("Connected to DB");}).
catch((err) => {console.log(err)});

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

//Root Route
app.get("/", (req, res) => {
    res.send("Hii... I'm Root")
})

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
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