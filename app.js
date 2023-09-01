const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {select} = require('./helpers/helper'); // Import the eq helper
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const dbURL = 'mongodb://127.0.0.1:27017/cms';
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB')) // Add a message here
  .catch(error => console.error('Error connecting to MongoDB:', error));

const app = express(); // Initialize the Express app

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Configure Handlebars as the view engine
app.engine(
  'handlebars',
  exphbs.engine({ defaultLayout: 'home', helpers: { select: select }}) // Include the select helper
  );
  app.set('view engine', 'handlebars');
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride('_method')); //use   methodOverride
// app.use(bodyParser.json); // Comment out this line
   app.use(upload());

// Import routes
const routes = require('./routes/main');
app.use('/', routes);

const PORT = process.env.PORT || 3000; // Use uppercase PORT

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
