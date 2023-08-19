const express = require('express');
const app = express(); // Change "new express()" to "express()"
const path = require('path');
const exphbs = require('express-handlebars');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Configure Handlebars as the view engine
app.engine('handlebars', exphbs.engine({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

// Define a route to render the index view
app.get('/', (req, res) => {
  res.render('home/index'); // Remove 'views/' from the path
});


// Define a route to render the about view
app.get('/about', (req, res) => {
  res.render('home/about'); // Remove 'views/' from the path
});

// Define a route to render the about view
app.get('/login', (req, res) => {
  res.render('home/login'); // Remove 'views/' from the path
});

// Define a route to render the about view
app.get('/register', (req, res) => {
  res.render('home/register'); // Remove 'views/' from the path
});


const port = process.env.PORT || 3000; // Correct 'port' to 'PORT'

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
