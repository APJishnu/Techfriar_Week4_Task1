const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailVerifiedAt: { type: Date, default: null },
    phone: { type: String, required: true },
    phoneVerifiedAt: { type: Date, default: null },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    aadhaarNumber: { type: String, default: null },
    aadhaarVerifiedAt: { type: Date, default: null },
    panNumber: { type: String, default: null },
    panVerifiedAt: { type: Date, default: null },
    bankAccountNumber: { type: String, default: null },
    bankVerifiedAt: { type: Date, default: null },
    gstNumber: { type: String, default: null },
    gstVerifiedAt: { type: Date, default: null },
    address:{
        pincode: { type: String, default:null },
        place: { type: String, default:null  },
        district: { type: String, default:null  },
        state: { type: String, default:null  },
        country: { type: String, default:null  },
        createdAt: { type: Date, default: null },    
    },
    registrationCompletedAt:{ type: Date, default: null },
    photo:{type: String, default:null } ,
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;
