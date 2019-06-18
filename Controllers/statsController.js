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

exports.getOneStat = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the user id is '+id)
  Stats.findOne({_id:id})
    .exec()
    .then( ( Stats ) => {
      res.render( 'oneStat', {
        stats:Stats, title:"OneStat"
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
