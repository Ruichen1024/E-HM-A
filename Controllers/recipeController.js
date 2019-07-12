'use strict';
const Recipe = require( '../models/recipe' );

exports.saveRecipes = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newRecipe = new Recipe(
   {
    name: req.body.name,
    ingredient: req.body.ingredient,
    description: req.body.description,
    userName: req.user.googlename,
    userId: req.user._id,
    createdAt: new Date()
   })

  //console.log("skill = "+newSkill)

  newRecipe.save()
    .then( () => {
      res.redirect( '/recipeAdded' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.getAllRecipes = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Recipe.find()
    .exec()
    .then( ( recipe ) => {
      res.render( 'recipes', {
        recipe:recipe, title:"recipe"
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

exports.deleteRecipe = (req, res) => {
  console.log("in deleteForumPost")
  let deleteId = req.body.delete
  if (typeof(deleteId)=='string') {
      // you are deleting just one thing ...
      Recipe.deleteOne({_id:deleteId})
           .exec()
           .then(()=>{res.redirect('/recipes')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='object'){
      Recipe.deleteMany({_id:{$in:deleteId}})
           .exec()
           .then(()=>{res.redirect('/recipes')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='undefined'){
      //console.log("This is if they didn't select a skill")
      res.redirect('/recipes')
  } else {
    //console.log("This shouldn't happen!")
    res.send(`unknown deleteId: ${deleteId} Contact the Developer!!!`)
  }

};
