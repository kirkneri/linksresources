const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const port = 8080;
const connectDB = require('./mbDatabase'); // Import the database connection

// Connect to MongoDB
connectDB();

// Middleware setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/img'));
app.use(methodOverride('_method'));

// Routes
const linksRoutes = require('./routes/linksRoutes');
app.use('/', linksRoutes);

// Port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
