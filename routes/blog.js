const {Router} = require('express');
const multer  = require('multer')
const Path = require("path");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { comma } = require('postcss/lib/list');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null,fileName);
  },
});

const upload = multer({ storage: storage })

router.get('/add-new', (req , res) =>{
    return res.render("addBlog" ,{
        user : req.user,
        Blog,
    });
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  if (!blog) return res.status(404).send("Blog not found");
  const comments = await Comment.find({blogId : req.params.id})
  .populate("createdBy","FullName profileImageURL");
  // console.log(comments);
  res.render("Blog", { 
    blog, 
    user: req.user,
    comments, });
});


router.post("/comment/:blogId", async(req , res) =>{
  await Comment.create({
    content : req.body.content,
    blogId :req.params.blogId,
    createdBy : req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/",upload.single('coverImg'), async(req , res) =>{
  if(!req.user){
    return res.redirect("/signin");
   }
   const {title , body} = req.body;
   try{
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
    // return res.redirect(`/blog/${blog._id}`);
    return res.redirect(`/blog/add-new`);
   }catch(error){
    console.error("Error creating blog:", error);
    return res.status(500).send("Error creating blog.");
   }
    
});


module.exports = router;