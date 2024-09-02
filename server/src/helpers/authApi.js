
module.exports = {

  aadhaarVerifyApi: async (aadhaar) => {
    try {
      var options = {
        method: 'POST',
        url: 'https://api.apyhub.com/validate/aadhaar',
        headers: {
          'apy-token': 'APY0EP4sQ4upwuOztt4WzWDBD6JOOVU3Dv3UiUNfckMVngzg2kRCkocN1yhBh59hbDsoKU',
          'Content-Type': 'application/json'
        },
        data: { aadhaar: aadhaar }
      };
      return options

    } catch (error) {
      console.log(error);
      return error
    }
  },

  panVerifyApi: async (panNumber) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://aadhaar-number-verification-api-using-pan-number.p.rapidapi.com/api/validation/pan_to_aadhaar',
        headers: {
          'x-rapidapi-key': 'bc046b5694msh7438399ac386c86p1636b4jsnea163db0ded8',
          'x-rapidapi-host': 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          pan: panNumber,
          consent: 'y',
          consent_text: 'I hear by declare my consent agreement for fetching my information via AITAN Labs API'
        }
      };
      return options

    } catch (error) {
      console.log(error);
      return error
    }
  },

  bankVerifyApiPost: async (bankAccountNumber, ifscCode) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://indian-bank-account-verification.p.rapidapi.com/v3/tasks/async/verify_with_source/validate_bank_account',
        headers: {
          'x-rapidapi-key': 'bc046b5694msh7438399ac386c86p1636b4jsnea163db0ded8',
          'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          task_id: '123',
          group_id: '1234',
          data: {
            bank_account_no: bankAccountNumber,
            bank_ifsc_code: ifscCode
          }
        }
      };
      return options

    } catch (error) {
      console.log(error);
      return error
    }
  },

  bankVerifyApiGet: async (requestId) => {
    try {
      const options = {
        method: 'GET',
        url: 'https://indian-bank-account-verification.p.rapidapi.com/v3/tasks',
        params: {
          request_id: requestId
        },
        headers: {
          'x-rapidapi-key': 'bc046b5694msh7438399ac386c86p1636b4jsnea163db0ded8',
          'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com'
        }
      };

      return options

    } catch (error) {
      console.log(error);
      return error
    }
  },


  gstVerifyApi: async (gstNumber) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate',
        headers: {
          'x-rapidapi-key': 'fdc582f5d1msh60d00801cbfe077p185df4jsn2ea20d746780',
          'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
          group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
          data: {
            gstin: gstNumber
          }
        }
      };
      return options

    } catch (error) {
      console.log(error);
      return error
    }
  },



  pinCodeVerifyApi: async (pincode) => {
    try {
      const pinCodeApi = `https://api.postalpincode.in/pincode/${pincode}`
      return pinCodeApi

    } catch (error) {
      console.log(error);
      return error
    }
  },

};
