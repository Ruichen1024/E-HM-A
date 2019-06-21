'use strict';
const User = require( '../models/User' );
const axios = require('axios');
var apikey = require('../config/apikeys');
console.dir(apikey)

exports.updateProfile = ( req, res ) => {

  User.findOne(res.locals.user._id)
  .exec()
  .then((p) => {
    console.log("just found a profile")
    console.dir(p)
    p.userName = req.body.userName
    p.bio = req.body.bio
    p.profilePicURL = req.body.profilePicURL
    p.zipcode = req.body.zipcode
    axios.get("https://www.zipcodeapi.com/rest/"+apikey.apikey.zipcode+"/info.json/"+p.zipcode+"/degrees")
      .then(function (response) {
        // handle success
        console.log(response);
        console.dir(response);
        p.city = response.data.city
        p.state = response.data.state
        p.lastLogin = new Date()
        p.save()
        .then(() => {
          res.redirect( '/profile' );
        })
      })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

  })
};
