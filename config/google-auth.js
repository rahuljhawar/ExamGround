
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const SocialUser = require('../app/models/SocialUser');
const configAuth = require('./auth');
const config = require('./config');
const jwt = require('jsonwebtoken');

module.exports =  (passport)=> {
    passport.serializeUser( (user, done)=> {
        //console.log(user);
        done(null, user.id);
    });
    passport.deserializeUser( (id, done) =>{
        SocialUser.findById(id,  (err, user)=> {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL
            //passReqToCallback: true
        },
         (accessToken, refreshToken, profile, done)=> {
            //console.log("callback function fired!");
            //console.log(profile);
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
          process.nextTick(function() {
                console.log(profile);
                SocialUser.findOne({
                    'id': profile.id
                },  (err, user) =>{
                    if (err)
                        return done(err);
                    if (user) {
                         token=jwt.sign({id:user.id,email:user.email,name:user.name}, config.jwtsecret, { expiresIn: '1h' });
                        return done(null, user);
                    } else {
                        let newSocialUser = new SocialUser();
                        newSocialUser.id = profile.id;
                        newSocialUser.name = profile.displayName;
                        newSocialUser.email = profile.emails[0].value;
                        newSocialUser.save(function (err) {
                            if (err)
                                throw err;
                            token=jwt.sign({id:newSocialUser.id ,email:newSocialUser.email,name:newSocialUser.name}, config.jwtsecret, { expiresIn: '1h' });
                            return done(null, newSocialUser);
                        });
                        //console.log(newSocialUser);
                    }
            });
        });
    }));
};