  const FacebookStrategy = require('passport-facebook').Strategy;
  const SocialUser = require('../app/models/SocialUser');
  const configAuth = require('./auth');
  const config = require('./config');
  const jwt = require('jsonwebtoken');

  module.exports =  (passport) =>{
      passport.serializeUser( (user, done) =>{
         
          done(null, user.id);
      });
      passport.deserializeUser( (id, done)=> {
          SocialUser.findById(id,  (err, user)=> {
              done(err, user);
          });
      });

      passport.use(new FacebookStrategy({
              clientID: configAuth.facebookAuth.clientID,
              clientSecret: configAuth.facebookAuth.clientSecret,
              callbackURL: configAuth.facebookAuth.callbackURL,
              profileFields: ['id', 'emails', 'name']
          },
           (accessToken, refreshToken, profile, done)=> {
              //console.log(profile);
              SocialUser.findOne({
                  'id': profile.id
              },  (err, user)=> {
                  if (err)
                      return done(err);
                  if (user) {
                      token=jwt.sign({id:user.id,email:user.email,name:user.name}, config.jwtsecret, { expiresIn: '1h' });
                      return done(null, user);
                  } else {
                      let newSocialUser = new SocialUser();
                      newSocialUser.id = profile.id;
                      newSocialUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                      newSocialUser.email = profile.emails[0].value;
                      newSocialUser.save(function (err) {
                          if (err)
                              throw err;
                          token=jwt.sign({id:newSocialUser.id ,email:newSocialUser.email,name:newSocialUser.name}, config.jwtsecret, { expiresIn: '1h' });
                          return done(null, newSocialUser);
                      });
                  }
              });
          }));
  };