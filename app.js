const express = require("express");
const {renderTemplate, parseXML2JSON} = require('./helpers');
const fetch = require('node-fetch');
const queryDB = require('./db');

/**
 * Creating Express Server
 */
const app = express();

app.get('/', (req, res) => {
    renderTemplate('templates/index.html', res);
});


// If the test table doesn't already exist in the test database this route can be used to create it.
app.get('/create-test-table', (req, res)=>{
    // SQL query string that will create a new test table
    let SQL = `CREATE TABLE test(
                    id INT AUTO_INCREMENT NOT NULL, 
                    pubDate DATETIME NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    link VARCHAR(2048) NOT NULL,
                    source VARCHAR(64),
                    PRIMARY KEY(id)
                )`;
    // Taking the query string from above and running it on the database to actually create the table
    // and also handling the response
    queryDB(SQL, (err) =>{
        if(err){
            res.send(err.sqlMessage);
        }else{
            res.send("Table Created...");
        }
        res.end();
    });
});

app.get('/api/search-term/:searchTerm', (req, res) =>{
    // Getting search parameter from the url
    const searchTerm = req.params.searchTerm;

    // Making a fetch request to the Google RSS api to get the results of the searchTerm
    fetch(`https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en&q=${searchTerm}`,{
        method: 'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/rss+xml',
        }
    })
        .then(res => res.text()) // Converting the XML response into TEXT
        .then(data =>{

            // Parsing XML text into json, then extracting the desired data using the a parseXML2JSON function.
            // Using the callback function parameter to query the database and INSERT the rows into the database table.
            parseXML2JSON(data, (values) =>{
                // Return a response
                res.send(values); // Sending that data as a response to the frontend.
                res.end(); // Ending the response

                // Creating the SQL query that will insert multiple rows into our database
                let SQL = "INSERT INTO test (pubDate, title, link, source) VALUES ?";

                //Connecting to the database to run the query and make the actual changes to the database
                queryDB(SQL, [values]);
            });
        })
        .catch(error =>{
            console.log(error);
        });

});

// Specifying static file directory path to serve static files
app.use(express.static('static'));

// 404 Response
app.use((req, res)=>{
    // Set status error to 404
    res.status(404);

    // Render the 404 html page
    renderTemplate("templates/Error404.html", res);
});


app.listen(8000, () =>{
    console.log("Server running at http://127.0.0.1:8000/");
});



