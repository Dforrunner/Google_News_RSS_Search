const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

const { User, Article} = require('../models');

// Login Page
router.get('/login', (req, res) =>  res.render('users/login'));

// Register Page
router.get('/register', (req, res) =>  res.render('users/register'));

// Register Handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = {
        errors: false,
        registered: false,
        nameError: null,
        emailError: null,
        passwordError: null,
        password2Error: null
    };

    /**
     * Form Validations
     */
    // Email format regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Check required fields
    if(!name)
        Object.assign(errors,{errors: true, nameError: "Name is required."});
    if(!email)
        Object.assign(errors,{errors: true, emailError: "Email is required."});
    if(!password)
        Object.assign(errors,{errors: true, passwordError: "Password is required."});
    if(!password2)
        Object.assign(errors,{errors: true, password2Error: "Confirmation password is required."});

    // Check email format
    if(!(emailRegex.test(email)) && email)
        Object.assign(errors,{errors: true, emailError: "Incorrect email format."});

    // Check passwords match
    if(password !== password2 && password2)
        Object.assign(errors,{errors: true, password2Error: "Passwords must match."});

    // Check password length
    if(password.length < 6 && password)
        Object.assign(errors,{errors: true, password2Error: "Password must be at least 6 characters."});


    if(errors.errors){
        res.json(errors);
    }else{
        // Check if user exists
        db.query(User.getEmail, email, (err, result) => {
            if(err) throw err;
            // If we get a result that means the email is already registered
            if(result.length > 0){
                // If registered set registered and errors to true and return error response
                errors.errors = true;
                errors.registered = true;
                res.json(errors);
            }else{
                // If there are no errors and the user is not registered, then register the user
                // But first  encrypt the password using bcrypt
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err;
                        db.query(User.create, [name, email, hash], (err, result) =>{
                            if(err) throw err;
                            console.log('New user created...');
                            req.flash('success_msg', 'You are now registered. Try to login.');
                            res.status(200).json({redirect: '/users/login'});
                        });
                    })
                );
            }
        });
    }

});


module.exports = router;