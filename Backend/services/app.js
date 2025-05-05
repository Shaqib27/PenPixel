require("dotenv").config();
const express = require("express");
const Path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

const UserRouter = require("./routes/user");
const BlogRouter = require("./routes/blog");


const { checkForAuthenticationCookies } = require("./middlewares/authentication");

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow Vercel/React
    credentials: true // Enable cookies for auth
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    // console.log("all Blog",allBlogs);
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
    // console.log("Blog create : ",allBlogs);
});

app.use("/api/user", UserRouter);
app.use("/api/blog", BlogRouter);


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });