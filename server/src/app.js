require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { db } = require('./config/database')

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Adjust this to your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true                 // Allow cookies
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use environment variable for the secret
  resave: false,
  saveUninitialized: false,         // Set to false to avoid saving empty sessions
  cookie: { secure: false, httpOnly: true },// Use secure cookies in production (secure: true)
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/TestRegistration'
  })
}));


app.use('/uploads', express.static('uploads'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
