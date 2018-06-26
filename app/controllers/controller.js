// Dependencies
// =============================================================
var express = require("express");
var router = express.Router();
var model = require("../models/model.js");
var path = require("path");
var bodyParser = require("body-parser");

// Routes
// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Map trucks
router.get("/map", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/map.html"));
});

// Add/Update trucks
router.get("/input", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/userInput.html"));
});

// Shows all trucks data
router.get("/data", function(req, res) {
    model.selectall(function(data) {
    res.json(data);
    //console.log(data);
  });
});

// Shows all trucks data based on the column and the id of the truck
router.get("/data/:table/:col/:id", function(req, res) {
  var id = req.params.id;
  var table = req.params.table;
  var col = req.params.col;
  model.selectOne(table,col, id, function(data) {
  res.json(data);
  console.log(data);
  });
});

// returns all the locations of the food truck
router.get("/locations", function(req, res) {
  model.selectlocations(function(data) {
    res.json(data);
  });

});

//Adds New food truck
router.post("/api/model", function(req, res) {
  console.log('server got', JSON.stringify(req.body, null, 2))
  model.createone(req.body.keys, req.body.values, function(result) {

  var keys = [ 'foodtruck_name', 'contact', 'descr', 'cuisine', 'location', 'date'];
  var values = [req.body.foodtruck_name, req.body.contact, req.body.descr, req.body.cuisine, req.body.location, req.body.date];
  console.log ('keys:' + keys);
  console.log ('values :' + values);
   model.createone(keys, values, function(result) {
      // res.json({ id: result.insertId });
      res.json({ id: result.id });
      console.log("result from createone" + result);
    });
  });
});

//Update keys to values in row with id
router.put("/api/model/:id", function(req, res) {
  var keys = [ 'foodtruck_name', 'contact', 'descr', 'cuisine', 'location', 'date'];
  var values = [req.body.foodtruck_name, req.body.contact, req.body.descr, req.body.cuisine, req.body.location, req.body.date];
  
  model.updateone(keys, values, req.body.id, function(result) {
      if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.json(result);
      res.status(200).end();
    }
  );
});

// Export routes for server.js to use.
module.exports = router;
