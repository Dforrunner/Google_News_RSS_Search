const express = require('express');
const router = express.Router();
const parseXML2JSON = require('../helpers/parseXML');
const fetch = require('node-fetch');

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
                parseXML2JSON(data, (values) =>{

                // Return json response of parsed data and current userID if there is one
                res.json({values, isAuthenticated: req.isAuthenticated(), userID: res.locals.userID}); // Sending that data as a response to the frontend.
                res.end(); // Ending the response
            });
        })
        .catch(error =>{
            console.log(error);
        });

});

module.exports = router;