const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = {
  SignUp: async (values, callback) => {
    try {
      let errors = {};

      // Check if the user already exists by email
      let userExist = await User.findOne({ email: values.email });
      if (userExist) {
        errors.email = 'User with this email already exists';
      }

      // Check if the phone number already exists
      userExist = await User.findOne({ phone: values.phone });
      if (userExist) {
        errors.phone = 'User with this phone number already exists';
      }

      // If there are any validation errors, return them
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        return callback(errors, null); // Important: return the errors via callback
      }

      // Proceed with user creation if no errors
      const user = new User({
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.dob,
        password: bcrypt.hashSync(values.password, 10)
      });

      const savedUser = await user.save();
      userId = savedUser._id.toString()
      callback(null, userId); // If user created successfully, pass user in callback

    } catch (error) {
      console.error("Error during signup:", error);
      // This is only for unexpected server-side errors
      callback({ general: 'An unexpected error occurred.' }, null);
    }
  },
  
  verifyOtp: (userID, userInputField, userInputValue, userInputOtp) => {
    const { userId, otp, field, value } = req.session.otpData || {};

    if (!otp || !field || !value) {
      console.log('No OTP data found in session');
      return;
    }

    if (userId === userID && otp === userInputOtp && field === userInputField && value === userInputValue) {
      console.log(`OTP verified successfully for ${field}: ${value}`);
      // Proceed with further actions, like marking OTP as verified
    } else {
      console.log('Invalid OTP');
      // Handle invalid OTP case
    }
  },





  //user Login

  login: async (emailOrPhone, password) => {
    try {
      // Find user by email or phone
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
      });
  
      // Check if user exists
      if (!user) {
        // User not found with email or phone
        return { error: { emailOrPhone: 'No user found with this email or phone number.' } };
      }
  
      // Check if registration is completed
      // if (!user.registrationCompletedAt) {
      //   return { error: { general: 'User registration not completed.' } };
      // }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Incorrect password
        return { error: { password: 'Incorrect password. Please try again.' } };
      }
  
      // If successful, return the user
      return { user };
  
    } catch (error) {
      console.error("Error during login:", error);
      return { error: { general: 'An unexpected error occurred during login. Please try again later.' } };
    }
  },
  
  
};
