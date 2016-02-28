"use strict";
var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
  occupation: {},
  region: {},
  summary: {},
  trend_comparison: {},
  employing_industries: {}
});

exports.Data = mongoose.model('Data', DataSchema);
