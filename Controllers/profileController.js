'use strict';
const User = require( '../models/User' );

exports.updateProfile = ( req, res ) => {

  User.findOne(res.locals.user._id)
  .exec()
  .then((p) => {
    console.log("just found a profile")
    console.dir(p)
    p.userName = req.body.userName
    p.bio = req.body.bio
    p.profilePicURL = req.body.profilePicURL
    p.lastLogin = new Date()
    p.save()
    .then(() => {
      res.redirect( '/profile' );
    })

  })
};
