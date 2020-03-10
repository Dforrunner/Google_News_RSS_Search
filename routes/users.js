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

    // Check if user exists
    db.query(User.getEmail, email, (err, result) => {
        if(err) throw err;
        if(result.length > 0){console.log(result);
            if(result[0] === email){
                errors.errors = true;
                errors.registered = true;
            }
        }
    });

    if(errors.errors){
        res.json(errors);
    }else{
        db.query(User.create, [[name, email, password]], (err, result) =>{
            if(err) throw err;
            console.log(result);
        });
        res.json('good');
    }

});


module.exports = router;