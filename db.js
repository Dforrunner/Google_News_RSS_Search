/**
 * Creating database connection
 */
const mysql = require('mysql');

function queryDB(SQL, values = null, callback) {

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

    db.query(SQL, values, (err, result) => {
        if(err) {
            console.log(err);
            if(callback){
                callback(err.message);
            }
        }else{
            console.log(result);
            if(callback){
                callback("Table Created...");
            }
        }
    });

    db.end();
}

module.exports = queryDB;