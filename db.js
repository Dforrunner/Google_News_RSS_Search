/**
 * Creating database connection
 */
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'test'
});

db.connect((err) => {
    // in case of throw error
    if(err) throw err;

    // Otherwise log success message
    console.log("MySql Connected...");
});

function queryDB(SQL, values = null, callback) {

    db.query(SQL, values, (err, result) => {
        if(err) {
            console.log(err);
            if(callback){
                callback(err);
            }
        }else{
            console.log(result);
        }
    });
}

module.exports = queryDB;