require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const port = process.env.PORT || 8080;
const connectDB = require('./mbDatabase'); 
const expressLayouts = require('express-ejs-layouts');
// Connect to MongoDB
connectDB();

// Middleware setup
app.use(expressLayouts);
app.set('layout', './layouts/layouts.ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/img'));
app.use(methodOverride('_method'));

// Routes
app.use('/', require('./routes/linksRoutes'));
app.use('/', require('./routes/notesRoutes'));

// Port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
