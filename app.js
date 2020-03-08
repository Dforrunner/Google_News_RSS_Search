const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Specifying static file directory path to serve static files
app.use(express.static('static'));

// 404 Page not found Response
app.use((req, res)=>{
    // Set status error to 404
    res.status(404);

    // Render the 404 page
    res.render("Error404");
});

app.listen(8000, () =>{
    console.log("Server running at http://127.0.0.1:8000/");
});



