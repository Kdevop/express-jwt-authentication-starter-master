const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

// OK, so this how where you do your session middleware, as in do the protected routes work. the passport.authenticate you will need to add this to every route you want to protect. 
router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.status(200).json({ success: true, msg: 'You are authorized. '});
});

// We will log them in and issue a jwt.
router.post('/login', function(req, res, next){
    User.findOne({ username: req.body.username }) //this just find the user in mongodb - we will be using postgres. 
        .then((user) => {

            if(!user) {
                res.status(401).json({ sucess: false, msg: "could not find user" }); //if the user is not there then tell em!
            }

            const isValid = utils.validPassword(req.body.password, user.hash, user.salt) //this checks the password, we wil be using bcrypt. 

            if (isValid) {

                const tokenObject = utils.issueJWT(user); //if it is valid we isse the token based on the user, like with register we may need an object back from the postgres to get the id.

                res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" });

            }
        })
        .catch((err) => {
            next(err);
        });
});

// We will register them and then issue a jwt and consider them logged in. 
router.post('/register', function(req, res, next){
    //for this he used crypto but I will use bcrypt. Also as I am using postgressql and not mongodb, some of these steps will be different, but the process is the same..
    //validate the results, protect the password, put in database. 
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({ 
        username: req.body.username, 
        hash: hash,
        salt: salt
    });

    newUser.save() //when you save the user to the DB in postgres, I think you will need the database to return the user details in full as an object, so that you can..
    //access this in for the next steps in issuing a token.
        .then((user) => {

            const jwt = utils.issueJWT(user);

            res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires }); //in this line we issue a jwt token that is sent to the client. 
        })
        .catch(err => next(err));
});

module.exports = router;