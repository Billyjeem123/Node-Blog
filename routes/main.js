const express = require('express')
const router = express.Router() //User Router method in express
const exphbs = require('express-handlebars')
const Post = require('../models/Post')

// This route  speaks to all admin routes only
router.all('/admin/*', (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
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
})

// Admin Routes..........

router.get('/admin/post', (req, res) => {
  res.render('admin/post') // Remove 'views/' from the path
})

router.post('/admin/post/create', async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.files || !req.files.files || req.files.files.size === 0) {
      const errorMessage = 'No file uploaded'
      return res.render('admin/post', { errorMessage })
    }

    const { title, poststatus, desc, allow } = req.body

    if (!title || !desc) {
      const errorMessage = 'Title or description are required fields.'
      return res.render('admin/post', { errorMessage })
    }

    // Get the file name
    const filename = req.files.files.name

    const newFileName = Date.now() + filename

    // Create a directory to store the uploaded file
    const dirUpload = `./public/uploads/${newFileName}`

    // Move the file to the specified directory
    req.files.files.mv(dirUpload, async err => {
      if (err) {
        return res.status(500).send(err)
      }

      const isAllowed = allow === 'on'

      try {
        // Assuming you have a Post model and a create method that interacts with your database
        const newPost = await Post.create({
          title,
          poststatus,
          desc,
          allow: isAllowed,
          file: newFileName
        })

        if (newPost) {
          res.send('Saved successfully')
        } else {
          res.send('Failed to save successfully')
        }
      } catch (error) {
        console.error('Error creating post:', error)
        res
          .status(500)
          .json({ error: 'An error occurred while creating the post' })
      }
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})




function checkRequiredParameters(params, requiredFields) {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!(field in params) || !params[field].trim()) {
      missingFields.push(field);
    }
  }



router.get('/admin/getposts', async (req, res) => {
  try {
    const posts = await Post.find().lean()

    if (!posts || !Array.isArray(posts)) {
      console.log('No posts found')
    }

    res.render('admin/getposts', { posts: posts })
    // res.send(posts);
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'An error occurred while fetching posts' })
  }
})

router.get('/admin/editposts/:id', async (req, res) => {
  try {
    const postId = req.params.id // Extract the post ID from the URL parameter
    const post = await Post.findById(postId).lean() // Use findById to find the post by its ID

    if (!post) {
      console.log('Post not found')
      return res.redirect('/admin/getposts') // Redirect to the posts list page or handle accordingly
    }

    res.render('admin/editpost', { post: post }) // Render the editpost template with the found post
  } catch (error) {
    console.error('Error fetching post:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the post'.error })
  }
})

router.post('/admin/updatepost/:id', async function (req, res) {
  try {
    const postId = req.params.id // Extract the post ID from the URL parameter

    const updatedPostData = {
      title: req.body.title,
      poststatus: req.body.poststatus,
      desc: req.body.desc,
      allow: req.body.allow === 'on' // Convert string 'on' to boolean
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedPostData, {
      new: true
    }).lean()

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.redirect('/admin/getposts')
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while updating the post.' })
  }
})

router.post('/admin/deletepost/:id', async (req, res) => {
  try {
    const postId = req.params.id

    // Find the post by ID and delete it
    const deletedPost = await Post.findByIdAndDelete(postId)

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.redirect('/admin/getposts')
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the post.' })
  }
})
}

//Exports routes;

module.exports = router
