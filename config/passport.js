const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


//this was the first thing we did, and it just verifies that the jwt is valid and returns the user. WHen we first wrote this there was no jwt issued, we need to do this in the login route. 

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //This says where we are going to find the jwt token, in the header of the request. 
    secretOrKey: PUB_KEY, //We are using a public key, rather than just a secret in the .env file. This is to verify, we sign with private key and verify with public key.
    algorithms: ['RS256'] //This is the algorithm for the keys. 
};

const strategy = new JwtStrategy(options, (payload, done) => {
    User.findOne({ _id: payload.sub}) //this is finding the user in the database, we will use postgres sql.
        .then((user) => {
            if(user) { //for this, we already have the jwt token, that we have validated, so we just need to return the user if we have one. 
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, null));
});

module.exports = (passport) => {
    passport.use(strategy);
}