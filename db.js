const { User, Article} = require('./models');
const mysql = require('mysql');

// Creating database connection
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

    // Run queries to build DB Schema
    db.query(User.table.create, (err, result) =>{
        if (err) throw err;
        console.log('User model created...')
    });
    db.query(Article.table.create, (err, result) =>{
        if (err) throw err;
        console.log('Article model created...')
    });
});

module.exports = db;