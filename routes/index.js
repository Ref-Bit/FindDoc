var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function (err, result) {
  console.log('Cassandra Connected');
});

/* GET HOME PAGE. */
router.get('/', function(req, res, next) {
    if (req.query.state) {
        var query = "SELECT * FROM findadoc.doctors WHERE state = ?";
        client.execute(query, [req.query.state], function (err, results) {
            if (err){
                res.status(404).send({msg: err});
            }else{
                res.render('index', {doctors: results.rows});
            }
        });

    }else{
        var query = "SELECT * FROM findadoc.doctors";
        client.execute(query, [], function (err, results) {
            if (err){
                res.status(404).send({msg: err});
            }else{
                res.render('index', {doctors: results.rows});
            }
        });
    }
});


/* GET DOCTORS DETAILS PAGE. */
router.get('/details/:id', function(req, res, next) {
  var query = "SELECT * FROM findadoc.doctors WHERE doc_id = ?";
  client.execute(query, [req.params.id], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    }else{
      res.render('partials/doctor', {doctor: result.rows['0']});
    }
  });
});

/* GET DOCTORS ACCORDING TO CATEGORY. */
router.get('/categories/:name', function(req, res, next) {
  var query = "SELECT * FROM findadoc.doctors WHERE category = ?";
  client.execute(query, [req.params.name], function (err, results) {
    if (err){
      res.status(404).send({msg: err});
    }else{
      res.render('partials/category', {doctors: results.rows});
    }
  });
});

router.post('/doctors/add', function (req, res, next) {
  var doc_id = cassandra.types.uuid();
  var query =  "INSERT INTO findadoc.doctors(doc_id, full_name, category, new_patients, graduation_year, practice_name, street_address, city, state)VALUES(?,?,?,?,?,?,?,?,?,?)";

  client.execute(query, [
      doc_id,
      req.body.full_name,
      req.body.category,
      req.body.new_patients,
      req.body.graduation_year,
      req.body.practice_name,
      req.body.street_address,
      req.body.city,
      req.body.state
      ], {prepare:true}, function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    }else{
      //req.flash('success', 'Doctor Added');
      res.location('/');
      res.redirect('/');
    }
  });
});


router.get('/categories/add', function (req, res, next) {
    var query = "SELECT * FROM findadoc.categories";
    client.execute(query, [], function (err, results) {
        if (err){
            res.status(404).send({'msg': err});
        }else{
            res.render('index', {categories: results.rows});
        }
    });
});

router.post('/categories/add', function (req, res, next) {
    var cat_id = cassandra.types.uuid();
    var query = "INSERT INTO findadoc.categories(cat_id, name)VALUES(?,?)";

    client.execute(query, [
        cat_id,
        req.body.name
    ], {prepare:true}, function (err, result) {
        if (err){
            res.status(404).send({msg: err});
        }else{
            //req.flash('success', 'Doctor Added');
            res.location('/');
            res.redirect('/');
        }
    });
});


module.exports = router;
