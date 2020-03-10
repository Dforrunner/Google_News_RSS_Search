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
        registered: false,
        errors: true,
        nameError: null,
        emailError: null,
        passwordError: null,
        password2Error: null
    };

    /**
     * Form Validations
     */
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!name) errors.nameError = "Name is required.";
    if(!email) errors.emailError = "Email is required.";
    if(!password) errors.passwordError = "Password is required.";
    if(!password2) errors.password2Error = "Confirmation password is required.";
    if(!(emailRegex.test(email)) && name) errors.emailError = "Incorrect email format.";
    if(password !== password2 && password2) errors.password2Error = "Passwords must match.";
    if(password.length < 6 && password) errors.passwordError = "Password must be at least 6 characters.";

    // Check if user exists
    db.query(User.getEmail, email, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            if(result[0] === email){
                errors.errors = true;
                errors.registered = true;
            }
        }
    });

    if(errors.errors){
        res.json(errors);
    }else{

        res.json('good');
    }

});


module.exports = router;