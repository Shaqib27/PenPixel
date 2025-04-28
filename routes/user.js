const {Router} = require('express');
const User = require('../models/user');
const router = Router();


router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signin" ,async(req , res) =>{
    const {email, password } = req.body;

    const user =await User.matchPassword(email , password);

    console.log("User ",user);
    return res.redirect("/");
})

router.post("/signup", async (req, res) => {
    const { FullName, email, password } = req.body;
    // Check if user already exists
    await User.create({ FullName, email, password });
    return res.redirect("/");
});



module.exports = router;