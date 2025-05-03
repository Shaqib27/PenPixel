require("dotenv").config();
const express = require("express");
const Path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

const UserRouter = require("./routes/user");
const BlogRouter = require("./routes/blog");


const { checkForAuthenticationCookies } = require("./middlewares/authentication");

app.set("view engine", "ejs"); // or pug, handlebars, etc.
app.set("views", Path.resolve("views")); // path to your views folder

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use(express.static("src"));


app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(Path.resolve("./public/")));
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    // console.log("all Blog",allBlogs);
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
    // console.log("Blog create : ",allBlogs);
});

app.use("/user", UserRouter);
app.use("/blog", BlogRouter);


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });