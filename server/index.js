require("dotenv").config()
const express = require("express")
const {json}= require("body-parser")
const cors = require("cors")
const app = express ()
const User = require("./mongo/Models/User")
const mongoose = require("mongoose");
const passport = require("passport")
const path = require("path");
const Auth0Strategy = require("passport-auth0");
const { getUser, logout } = require(`${__dirname}/auth0/authCtrl`);
const port = process.env.port || 3001;
const session = require("express-session");





//setting up sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 100000
      }
    })
  );





//AUTH SHIT
const { CLIENT_ID, CLIENT_SECRET, DOMAIN } = process.env;
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Auth0Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      domain: DOMAIN,
      callbackURL: "/login",
      scope: "openid profile"
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      done(null, profile);
    }
  )
);

//pulling the user and sending the info back to the front-end
passport.serializeUser((user, done) => {
    User.findOne({
      name: user.displayName,
      authID: user.id,
      picture: user.picture
    })
      .then(response => {
        if (!response) {
          const newUser = new User({
            name: user.displayName,
            authID: user.id,
            picture: user.picture,
            newUser: true
          });
          newUser
            .save()
            .then(res => {
              done(null, res);
            })
  
            .catch(err => console.log(err));
        } else {
          User.findOneAndUpdate({ authID: response.authID }, { new: true }).then(
            user => {
              done(null, user);
            }
          );
        }
      })
      .catch(err => console.log(err));
  });
  //I'm not sure what this does
  passport.deserializeUser((user, done) => done(null, user));
  
  // getting user with "getUser" from authCtrl
  app.get("/me", getUser);
  app.get("/logout", logout);
  

  
  //redirects user to the home page after logging in
  app.get(
    "/login",
    passport.authenticate("auth0", {
      // successRedirect: "/",
      successRedirect: `http://localhost:3000/#/signup`,
      // successRedirect: "/#/",
      failureRedirect: "/login"
    })
  );
  






//setting up mongo db database
const db= process.env.mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("mongoDB is ONLINE!"))
  .catch(err => console.log(err));


  //checking up on server
app.listen(port,()=>{
    console.log(`shit listening on port ${port}`)
})