const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../db');
const {User} = require('../models');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
                // By default passport checks for username, therefore we need to override it to check email
                usernameField: 'email'
            },
            (email, password, done) =>{
            // Query for user
            db.query(User.getUserByEmail, [email], (err, rows) =>{
                if(err) throw err;

                // Check if user found.
                // If the row.length = 1 then user is found if it's a 0 then a user is not found
                if(rows.length){
                    // Check user password
                    bcrypt.compare(password, rows[0].password, (err, isMatch) =>{
                        // if an exception occurred while verifying the credentials
                        if(err) return done(err);
                        if(isMatch){
                            // Return response if user entered correct email and password
                            return done(null, rows[0]);
                        }else{
                            // Return response if user found, but password is wrong
                            return done(null, false, {message: 'Incorrect password.'})
                        }
                    });
                }else{
                    // Return response if user not found
                    return done(null, false, {message: "Incorrect email."})
                }
            })
        })
    );

    // Serialize the user for the session
    passport.serializeUser((user, done) => done(null, user.UserID));
    // Deserialize the user from session
    passport.deserializeUser((id, done) => {
        db.query(User.getById, [id], (err, rows) => {
            console.log('De-serializing user...');
            //console.log(rows[0]);
            done(null, rows[0]);
        });
    });

};