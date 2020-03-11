const express = require('express');
const router = express.Router();
const db = require('../db');
const { ensureAuthenticated } = require('../config/auth');
const { Article} = require('../models');

// Article create handle
router.put('/save-article', ensureAuthenticated,  (req, res) => {
    db.query(Article.insertOne, req.body, (err, rows) => {
        if(err) throw err;
        res.json({success: true, articleID: rows.insertId});
    });
});

// Article delete handle
router.delete('/delete-article/:articleID', ensureAuthenticated,  (req, res) => {
    db.query(Article.delete, [req.params.articleID], (err, result) => {
        if(err) throw err;
        res.json({success: true});
    });
});

module.exports = router;