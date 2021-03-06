module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'Please login first.');
        res.status(401).redirect('/users/login');
    }
};