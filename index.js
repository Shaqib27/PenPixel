const express = require("express");
const Path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = 8010;
const UserRouter = require("./routes/user");

app.set("view engine", "ejs"); // or pug, handlebars, etc.
app.set("views", Path.resolve("views")); // path to your views folder

mongoose.connect("mongodb://localhost:27017/blogify")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

app.use(express.static("src"));

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/" ,(req,res )=>{
    res.render("home");
})

app.use("/user", UserRouter);




app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`);});