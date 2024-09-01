const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false }
});

module.exports = sessionMiddleware;
