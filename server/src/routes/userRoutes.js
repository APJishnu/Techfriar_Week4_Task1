const express = require('express');
const multer = require('multer');
const User = require('../models/user'); // Assuming the User model is in the models directory

const router = express.Router();

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/upload-profile-photo', upload.single('profilePhoto'), async (req, res) => {
    try {
      // Extract userId from form data
      const userId = req.body.userId; // Ensure this matches with what is passed from frontend
      
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      // Verify that the file was uploaded
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
  
      // Construct the image path
      const imagePath = `/uploads/${req.file.filename}`;
  
      // Find the user by userId and update the profile with the image path
      const user = await User.findByIdAndUpdate(userId, { photo: imagePath }, { new: true });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Send success response with the updated photo path
      res.status(200).json({ success: true, photo: user.photo });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      res.status(500).json({ success: false, message: 'Error uploading profile photo' });
    }
  });


  // In your user routes file
router.get('/get-profile-photo/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, photo: user.photo });
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      res.status(500).json({ success: false, message: 'Error fetching profile photo' });
    }
  });
  
  router.post('/remove-profilePhoto', async (req, res) => {
    try {
      const { userId } = req.body; // Extract userId from the request body
      
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      // Find the user and update the photo field to null or default
      const user = await User.findByIdAndUpdate(
        userId,
        { photo: null},  // Reset to default photo path or null
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Send success response with the updated photo path
      res.status(200).json({ success: true, photo: user.photo });
    } catch (error) {
      console.error('Error removing profile photo:', error);
      res.status(500).json({ success: false, message: 'Error removing profile photo' });
    }
  });
  

module.exports = router;
