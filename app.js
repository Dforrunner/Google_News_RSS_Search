const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

// Passport config
require('./config/passport')(passport);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Static files
app.use(express.static('static'));

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express session
app.use(session({
    secret: process.env.SERCRET_KEY || 'devKeyNotSoSecretOne',
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// 404 Page not found Response
app.use((req, res)=>{
    // Set status error to 404
    res.status(404);

    // Render the 404 page
    res.render("Error404");
});

// Listening port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>{
    console.log("Server running at http://127.0.0.1:8000/");
});



