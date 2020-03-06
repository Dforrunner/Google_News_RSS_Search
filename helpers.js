const fs = require("fs");
const parseString = require('xml2js').parseString;

// Helper function that renders html templates using the build in node js module
function renderTemplate(html, res) {
    return fs.readFile(html, (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}

/**
 * Helper Function that parses XML to JSON.
 * For the purposes of this project this helper function simply returns the title and pubData
 * as a 2D array: [[pudDate, title],]. NOTE: their order correspond with the database column order.
 * That is intentional because those value will be inserted into the MySql database
 *
 * @param xml: text input
 * @param callback: returns the values to a callback function
 * @return values: 2D array of pubDate and title values
 */

function parseXML2JSON(xml, callback){
    parseString(xml, (err, result) =>{
        if(err) console.log(err);
        let values = [];
        const channel = result.rss.channel[0].item;

        // Iterating over each item in the RSS XML response and extracting the pubDate and title from each item
        // then pushing into the value variable as arrays. This creates an array of arrays and this format is
        // understood by the node mysql module, therefore allowing us to INSERT multiple rows into the database quickly
        for(let item of channel){
            values.push([item.pubDate[0], item.title[0]]);
        }

        callback(values);
    })
}

module.exports = {renderTemplate, parseXML2JSON};