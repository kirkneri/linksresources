const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://devkirkbugayong:qwerty123@kodego.btziqza.mongodb.net/linksResource');
    console.log('MongoDB connection established.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
