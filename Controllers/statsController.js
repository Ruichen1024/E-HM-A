'use strict';
const Stats = require( '../models/Stats' );

exports.saveStats = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newStat = new Stats(
   {
    name: req.body.name,
    age: req.body.age,
    Blood_Pressure: req.body.bp,
    Pulse: req.body.pulse
   })

  //console.log("skill = "+newSkill)

  newStat.save()
    .then( () => {
      res.redirect( '/Added' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.getAllStats = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Stats.find()
    .exec()
    .then( ( Stats ) => {
      res.render( 'stats', {
        stats:Stats, title:"Stats"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
