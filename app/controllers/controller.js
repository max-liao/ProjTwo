// Dependencies
// =============================================================
var express = require("express");

var router = express.Router();

var model = require("../models/model.js");

var path = require("path");

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
  res.sendFile(path.join(__dirname, "../public/input.html"));
});

// Shows all trucks data
router.get("/data", function(req, res) {
    model.selectall(function(data) {
    res.json({model:data});
    console.log(data);
  });
});

// 
router.get("/locations", function(req, res) {
  model.selectlocations(function(data) {

    // var places = [];
    // for(var i = 0; i < data.length; i++){
    //   places[i] = data[i].location;
    // }
    //console.log(data[0].location);
    res.json(data);
    //console.log(places);
  });

})

//New row
router.post("/api/model", function(req, res) {
  model.createone(req.body.keys, req.body.values, function(result) {
    // res.json({ id: result.insertId });
    //res.json({ id: result.id });
    console.log("result from createone" + result);
  });
});

//Update keys to values in row with id
router.put("/api/model/:id", function(req, res) {
  model.updateone(req.params.keys, req.body.values, req.body.id, function(result) {
      if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
    }
  );
});

// Export routes for server.js to use.
module.exports = router;