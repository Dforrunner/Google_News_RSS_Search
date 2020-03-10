const express = require('express');
const router = express.Router();
const parseXML2JSON = require('../helpers');
const fetch = require('node-fetch');
const db = require('../db');
const {ArticleModel} = require('../models');

router.get('/', (req, res) => res.render('index'));

router.get('/api/search-term/:searchTerm', (req, res) =>{
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

                //Connecting to the database to run the query and make the actual changes to the database
                db.query(ArticleModel.insert, [values],(err, result) => {
                    if(err) {
                       console.log(err);
                    }else{
                        console.log(result);
                    }
                });
            });
        })
        .catch(error =>{
            console.log(error);
        });

});

router.get('/api/search-history/', (req, res) =>{
    let SQL = 'SELECT * FROM test';

    db.query(SQL, (err, result) => {
        if(err) {
            res.type('json').send(JSON.stringify(err, null, 2) + '\n');
        }else{
            res.type('json').send(JSON.stringify(result, null, 2) + '\n');
        }
    });

});

module.exports = router;