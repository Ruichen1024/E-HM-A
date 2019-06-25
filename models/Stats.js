'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var mySchema = Schema( {
  createdAt: Date,
  name: String,
  age: Number,
  Blood_Pressure: Number,
  Pulse: Number
} );

module.exports = mongoose.model( 'Stats', mySchema );
