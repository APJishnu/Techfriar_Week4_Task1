const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    
  photo: String, // Store the path to the uploaded image
  // other fields...
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
