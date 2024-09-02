const { validateRequest } = require('twilio/lib/webhooks/webhooks');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
  emailVerified: async (email, verifiedDate) => {
    try {
      console.log(verifiedDate)
      let updateObject = {
        emailVerifiedAt: verifiedDate,
      };

      const updatedEmailAt = await User.findOneAndUpdate(
        { email: email },
        {
          $set: updateObject,
        },
        { returnOriginal: false }
      );

      if (!updatedEmailAt) {
        // If no document was found and updated, return false
        return false;
      }

      return true

    } catch (error) {

      return false
    }
  },

  phoneVerified: async (phone, verifiedDate) => {
    try {
      console.log(verifiedDate)
      let updateObject = {
        phoneVerifiedAt: verifiedDate,
      };


      const updatedPhoneAt = await User.findOneAndUpdate(
        { phone: phone },
        {
          $set: updateObject,
        },
        { returnOriginal: false }
      );

      if (!updatedPhoneAt) {
        // If no document was found and updated, return false
        return false;
      }

      return true

    } catch (error) {

      return false
    }
  },


  aadhaarVerified: async (aadharNumber, userId) => {
    try {

      let updatedData = { aadhaarNumber: aadharNumber, aadhaarVerifiedAt: Date.now() }
      // Update user data in MongoDB
      const updatedAadhaarAt = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: updatedData
        },
        { returnOriginal: false }
      );

      if (!updatedAadhaarAt) {

        return false;
      }
      return true

    } catch (error) {

      return error
    }
  },

  panVerified: async (panNumber, userId) => {
    try {

      let updatedData = { panNumber: panNumber, panVerifiedAt: Date.now() }
      // Update user data in MongoDB
      const updatedPanAt = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: updatedData
        },
        { returnOriginal: false }
      );

      if (!updatedPanAt) {
        // If no document was found and updated, return false
        return false;
      }
      return true

    } catch (error) {

      return error
    }
  },



  bankVerified: async (bankAccountNumber, userId) => {
    try {
      console.log(userId)
      let updatedData = { bankAccountNumber: bankAccountNumber, bankVerifiedAt: Date.now() }

      // Update user data in MongoDB
      const updatedBankAt = await User.findOneAndUpdate(
        { _id: userId },
        { $set: updatedData },
        { new: true } // Ensure updated document is returned
      );

      if (!updatedBankAt) {
        return false;
      }
      return true

    } catch (error) {

      return error
    }
  },

  gstVerified: async (gstNumber, userId) => {
    try {
      console.log(userId)
      let updatedData = { gstNumber: gstNumber, gstVerifiedAt: Date.now() }

      // Update user data in MongoDB
      const updatedgstAt = await User.findOneAndUpdate(
        { _id: userId },
        { $set: updatedData },
        { new: true } // Ensure updated document is returned
      );

      if (!updatedgstAt) {
        return false;
      }
      return true

    } catch (error) {

      return error
    }
  },

  // authValidation.js
  addressSaved: async (data) => {
    try {
      console.log(data.userId); // Debugging log to ensure correct value is passed

      let updatedData = {
        address: {
          pincode: data.pincode,
          place: data.place,
          district: data.district,
          state: data.state,
          country: data.country,
          createdAt: Date.now(),

        },
        registrationCompletedAt: Date.now(),
      };

      // Update user data in MongoDB
      const updatedPinCodeAt = await User.findOneAndUpdate(
        { _id: data.userId }, // Make sure this field matches the one in the user schema
        { $set: updatedData },
        { new: true } // Return the updated document
      );

      if (!updatedPinCodeAt) {
        return false; // If no user found, return false
      }
      return true; // Successfully updated
    } catch (error) {
      console.error("Error saving address:", error); // Log the error for debugging
      return false; // Return false in case of an error
    }
  },

};
