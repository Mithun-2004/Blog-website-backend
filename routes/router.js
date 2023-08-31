const express = require('express');
const router = express.Router();

const Blog = require('../model/blogmodel');

router.get("/", async (req, res) => {
    const blogs = await Blog.find();
    res.render("allblogs", {blogs : blogs});
})

router.get("/new", (req, res) => {
    res.render("newBlog");
})


router.post("/", async (req, res) => {
    const data = new Blog ({
        title : req.body.title,
        body : req.body.body,
        author : req.body.author
    })
    try{
        await data.save();
        res.redirect("/blogs");
    }
    catch (err) {
        res.render("newBlog", {
            title : req.body.title,
            body : req.body.body,
            author : req.body.author
        });
    }

})

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog == null) res.redirect("/blogs");
    res.render("displayBlog", {blog:blog});
})



module.exports = router;