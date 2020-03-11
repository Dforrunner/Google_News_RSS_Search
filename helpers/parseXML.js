const parseString = require('xml2js').parseString;

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

    // Format pubDate to YYYY-MM-DD HH:MM:SS
    const formatPubDate = (date) => {
        const dateArr = date.split(' ');

        const monthIndex = {
            'Jan': '01',
            'Feb': '02',
            'Mar': '03',
            'Apr': '04',
            'May': '05',
            'Jun': '06',
            'Jul': '07',
            'Aug': '08',
            'Sep': '09',
            'Oct': '10',
            'Nov': '11',
            'Dec': '12'
        };

        return `${dateArr[3]}-${monthIndex[dateArr[2]]}-${dateArr[1]} ${dateArr[4]}`;
    };

    parseString(xml, (err, result) =>{
        if(err) console.log(err);
        let values = [];
        const channel = result.rss.channel[0].item;

        // Iterating over each item in the RSS XML response and extracting the pubDate, title, link, and source
        // from each item, then pushing into the value variable as arrays. This creates an array of arrays and
        // this format is understood by the node mysql module, therefore allowing us to INSERT multiple rows
        // into the database quickly
        for(let item of channel){
            // Convert pubDate into proper format
            let pubDate = formatPubDate(item.pubDate[0]);
            values.push([pubDate, item.title[0], item.link[0], item.source[0]['_'], item.guid[0]['_']]);
        }

        callback(values);
    })
}

module.exports = parseXML2JSON;