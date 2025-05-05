const { Router } = require('express');
const multer = require('multer')
const Path = require("path");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { comma } = require('postcss/lib/list');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Path.resolve(`./uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('createdBy');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  if (!blog) return res.status(404).send("Blog not found");
  const comments = await Comment.find({ blogId: req.params.id })
    .populate("createdBy", "FullName profileImageURL");
  // console.log(comments);
  res.json({ success: true, comments });
});


router.post("/:blogId/comment", async (req, res) => {
  const comments = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  res.json({ success: true, comments });
});

router.post("/", upload.single('coverImg'), async (req, res) => {
  if (!req.user) {
    return res.redirect("/signin");
  }
  const { title, body } = req.body;
  try {
    const blog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`
    });
    // // return res.redirect(`/blog/${blog._id}`);
    // return res.redirect(`/blog/add-new`);
    res.json({ sucess: true, blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).send("Error creating blog.");
  }

});


module.exports = router;