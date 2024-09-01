const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper');
const authValidation = require('../helpers/authValidation');
const sendEmail = require('../middlewares/mailer');
const sendSms = require('../middlewares/smsSender');
const axios = require('axios');
const authApi = require("../helpers/authApi");




// Route for user registration
router.post('/register', async (req, res) => {
  const { name, email, phone, dob, password } = req.body; // Removed 'aadhar'

  try {
    await authHelper.SignUp({ name, email, phone, dob, password }, (error, userId) => {
      if (error) {
        console.log(error);
        return res.status(201).json({ errors: error });
      }
      console.log(userId);
      
      res.status(201).json({
        message: 'User registered successfully',
        userId,

      });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ errors: { general: 'An unexpected error occurred.' } });
  }
});

// Route to send OTP
router.post('/send-otp', async (req, res) => {
  const { field, value } = req.body;

  try {
    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);

    // Define expiry time for the OTP (1 minute from now)
    const expiryTime = Date.now() + 60 * 1000; // Current time + 60 seconds

    // Store OTP and expiry time in session
    req.session.otp = {
      field,
      value,
      otp,
      expiryTime
    };
    console.log("OTP stored in session:", req.session.otp);

    const subject = 'Your OTP for Verification';
    const text = `Your OTP is ${otp}`;
    const html = `<p>Your OTP is <strong>${otp}</strong></p>`;

    if (field === 'email') {
      await sendEmail(value, subject, text, html);
    } else if (field === 'phone') {
      await sendSms(value, otp);
    }

    // Respond with success
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
});


// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { field, value, otp } = req.body;

  try {
    const sessionOtp = req.session.otp;

    console.log("Session OTP:", sessionOtp);

    if (!sessionOtp) {
      return res.status(400).json({ message: 'No OTP found. Please request an OTP first.' });
    }

    // Check if OTP has expired
    if (Date.now() > sessionOtp.expiryTime) {
      return res.status(200).json({ message: 'OTP has expired.' });
    }

    // Validate that the OTP matches
    if (otp === sessionOtp.otp && field === sessionOtp.field && value === sessionOtp.value) {
      const date = Date.now();

      if (field === "email") {
        const respond = await authValidation.emailVerified(value, date);
      } else if (field === 'phone') {
        await authValidation.phoneVerified(value, date);
      }

      // OTP verified successfully, respond accordingly
      req.session.otp = null; // Optionally, clear OTP from session
      res.status(200).json({ verified: true });
    } else {
      req.session.otp = null; 
      res.status(200).json({ message: 'Invalid OTP.' });
    }
  } catch (err) {
    req.session.otp = null; 
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'An error occurred during OTP verification.' });
  }
});




// Aadhaar Verification Route
router.post('/verify-aadhar', async (req, res) => {
  const { aadharNumber, userId } = req.body;
  console.log("userId",userId)
  try {

    const options = await authApi.aadhaarVerifyApi(aadharNumber);

    const response = await axios.request(options);

    if (response.data.data === true) {
      await authValidation.aadhaarVerified(aadharNumber, userId)

      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Aadhaar verification failed. Please try again later.' });
  }
});



// PAN Verification Route
router.post('/verify-pan', async (req, res) => {
  const { panNumber, userId } = req.body;
  console.log(userId)
  try {
    const options = await authApi.panVerifyApi(panNumber);

    const response = await axios.request(options);

    if (response.data) {
      await authValidation.panVerified(panNumber, userId);

      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (err) {
    console.error('pan verification error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'pan verification failed. Please try again later.' });
  }
});



router.post('/verify-bank', async (req, res) => {
  const { bankAccountNumber, ifscCode } = req.body;
  
  try {
    const options = await authApi.bankVerifyApiPost(bankAccountNumber,ifscCode );
    const response = await axios.request(options);
    res.status(200).json({
      success: true,
      requestId: response.data.request_id, // Get requestId from the response
      bankAccountNumber: bankAccountNumber,
      message: 'Bank verification initiated successfully.'
    });
  } catch (error) {
    console.error('Error initiating bank verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate bank verification.',
      error: error.message
    });
  }
});



// GET route to check verification status
router.get('/check-bank-status', async (req, res) => {
  const { requestId ,userId,bankAccountNumber} = req.query;
  console.log(userId)
  console.log(requestId)

  // Ensure requestId is provided
  if (!requestId) {
    return res.status(400).json({
      success: false,
      message: 'Missing requestId parameter.'
    });
  }

  try {
    const options = await authApi.bankVerifyApiGet(requestId);
    const response = await axios.request(options);
    const { data } = response;

    // Assuming response.data is an array
    if (data && data.length > 0) {
      const task = data[0]; // Take the first task if it's an array
      const { status, result } = task;

      if (status === 'completed') {

        await authValidation.bankVerified(bankAccountNumber, userId);

        res.status(200).json({
          success: true,
          message: 'Bank account verified successfully.',
          data: result // Pass result for additional information
        });
      } else {
        res.status(200).json({
          success: false,
          message: 'Bank account verification failed.',
          data: result
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'No verification task found for the given requestId.'
      });
    }
  } catch (error) {
    console.error('Error fetching bank verification status:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bank verification status.',
      error: error.message
    });
  }
});


// Assuming authApi.gstVerifyApi is a function that returns the required options for the API request
router.post('/verify-gst', async (req, res) => {
  const { gstNumber, userId } = req.body;
  console.log(req.body);

  try {
    const options = await authApi.gstVerifyApi(gstNumber);
    const gstResponse = await axios.request(options);
    console.log(gstResponse.data);

    const gstin = gstResponse.data.result.source_output.gstin;

    if (gstin && gstin !== null) {

      await authValidation.gstVerified(gstNumber, userId);      
      res.status(200).json({
        success: true,
        message: 'GST verified successfully.',
        data: gstResponse.data // Pass the full result for additional information
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'GST verification failed. GSTIN not found or invalid.'
      });
    }
  } catch (error) {
    console.error('Error verifying GST:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying GST.'
    });
  }
});


router.post('/verify-pincode', async (req, res) => {
  const { pincode ,userId} = req.body;

  if (!pincode) {
    return res.status(400).json({ message: "PIN code is required." });
  }
  try {
    const pinCodeApi = await authApi.pinCodeVerifyApi(pincode);
    const response = await axios.get(pinCodeApi);
    const data = response.data;
    const objectData = data[0];
    console.log(objectData)

    if (objectData.Status === "Success" && objectData.PostOffice && objectData.PostOffice.length > 0) {
      const postOffice = objectData.PostOffice[0]; // Assuming you want the first post office record
      const address = `${postOffice.Division}, ${postOffice.District}, ${postOffice.State}, ${postOffice.Country}`;

      res.json({
        success: true,
        message: "Pincode verified successfully.",
        address: address
      });
    } else {
      res.json({
        success: false,
        message: "No records found for the given PIN code.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying the PIN code.",
    });
  }
});




// routes/user.js
router.post('/add-address', async (req, res) => {
  const data = req.body; // Ensure body contains the data
  console.log(data.country); // Debugging log to check if the country is being passed correctly

  try {
    // Validate input
    if (!data.userId || !data.pincode || !data.place || !data.district || !data.state || !data.country) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Call addressSaved and pass the data
    const addressSaved = await authValidation.addressSaved(data);

    if (!addressSaved) {
      return res.status(500).json({ success: false, message: "Error saving address" });
    }

    return res.status(200).json({ success: true, message: "User and address saved successfully" });
  } catch (error) {
    console.error("Error saving user and address:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});




// Route for user login
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Attempt to login the user
    const response = await authHelper.login(emailOrPhone, password);

    // If there is an error from the login function, handle it
    if (response.error) {
      return res.status(401).json({ errors: response.error });
    }

    // If login is successful, store user data in session
    const user = response.user;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    req.session.loggedIn = true

    // Respond with success
    return res.status(200).json({
      message: 'Login successful',
      user: req.session.user // Optionally return user info to the frontend
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ errors: { general: 'An unexpected error occurred during login.' } });
  }
});

// Route to check login status
router.get('/check-login', (req, res) => {
  if (req.session.loggedIn) {
    return res.status(200).json({ user: req.session.user });
  }
  return res.status(401).json({ message: 'Not authenticated' });
});



// Route for user logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // Adjust according to your cookie settings
    res.status(200).json({ message: 'Logout successful' });
  });
});




module.exports = router;
