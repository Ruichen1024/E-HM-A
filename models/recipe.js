'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var recipeSchema = Schema( {
  userId: ObjectId,
  name: String,
  ingredient: String,
  description: String,
  userName: String,
  createdAt: Date
} );

module.exports = mongoose.model( 'recipe', recipeSchema );
