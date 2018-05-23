// Dependencies
// =============================================================

// Sequelize (capital) references the standard library
var express = require("express");

var router = express.Router();

var model = require("../models/model.js");

// Routes
// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  model.selectall(function(data) {
    res.render("index", {model:data});
  });
});

router.post("/api/model", function(req, res) {
  model.createone(req.body.keys, req.body.values, function(result) {
    // Send back the ID of the new quote
    // res.json({ id: result.insertId });
    res.json({ id: result.id });
  });
});

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