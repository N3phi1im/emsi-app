"use strict";
var express = require('express');
var mongoose = require('mongoose');
var Data = mongoose.model('Data');
var router = express.Router();

router.post('/', function(req, res, next) {
  Data.find({})
  .exec(function(err, data) {
    res.send(data[0]);
  });
});

router.use(function(err, req, res, next) {
  res.status(500).send(err);
});

module.exports = router;
