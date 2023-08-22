const express = require('express')
const router = express.Router() //User Router method in express
const exphbs = require('express-handlebars')
const Post = require('../models/Post');

// This route  speaks to all admin routes only
router.all('/admin/*', (req, res, next) => {
  req.app.locals.layout = 'admin'
  next();
})

// Define a route to render the index view
router.get('/', (req, res) => {
  res.render('home/index') // Remove 'views/' from the path
})

// Define a route to render the about view
router.get('/about', (req, res) => {
  res.render('home/about') // Remove 'views/' from the path
})

// Define a route to render the about view
router.get('/login', (req, res) => {
  res.render('home/login') // Remove 'views/' from the path
})

// Define a route to render the about view
router.get('/register', (req, res) => {
  res.render('home/register') // Remove 'views/' from the path
})

// Admin Routes..........
router.get('/admin/index', (req, res) => {
  res.render('admin/index') // Remove 'views/' from the path
});



// Admin Routes..........
router.get('/admin/post', (req, res) => {
    res.render('admin/post') // Remove 'views/' from the path
  });

  router.post('/admin/post/create', async (req, res) => {
    try {
      const { title, poststatus, desc, allow } = req.body;

      const isAllowed =  (allow === "on")?(true): (false);
      // Assuming you have a Post model and a create method that interacts with your database
      const newPost = await Post.create({
        title,
        poststatus,
        desc,
        allow: isAllowed,
      });

    if(newPost){
      res.send("Saved sucessfully");
    }else{
      res.send("Failed to save sucessfully");
    }
           
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'An error occurred while creating the post' });
    }
  });


  router.get('/admin/getposts', async (req, res) => {
    try {
      const posts = await Post.find().lean();
  
      if (!posts || !Array.isArray(posts)) {
        console.log('No posts found');
      }
  
      res.render('admin/getposts', { posts: posts });
      // res.send(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'An error occurred while fetching posts' });
    }
  });


  router.get('/admin/editposts/:id', async (req, res) => {
    try {
      const postId = req.params.id; // Extract the post ID from the URL parameter
      const post = await Post.findById(postId).lean(); // Use findById to find the post by its ID
  
      if (!post) {
        console.log('Post not found');
        return res.redirect('/admin/getposts'); // Redirect to the posts list page or handle accordingly
      }
  
      res.render('admin/editpost', { post: post }); // Render the editpost template with the found post
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'An error occurred while fetching the post' });
    }
  });
  
  

//Exports routes;

module.exports = router
