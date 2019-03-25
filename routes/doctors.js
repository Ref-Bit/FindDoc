var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function (err, result) {
  console.log('Cassandra Connected');
});

/* GET Doctor Page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Our Doctors'});
});

