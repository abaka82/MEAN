var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var User = mongoose.model('User');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/', isAuthenticated);


//api for all posts
router.route('/')

    //gets all posts
    .get(function(req, res){
        User.find(function(err, posts){
            if(err){
                return res.send(500, err);
            }
            return res.send(posts);
        });
    });

//api for a specfic post
router.route('/:id')
    //gets specified post
    .get(function(req, res){
        User.findById(req.param('id'), function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });

    });

module.exports = router;