// Dependencies
// =============================================================
// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var model = {
  selectall: function(cb) {
    orm.selectAll("project2_db", function(res) {
      cb(res);
    });
  },
  
  createone: function(keys, values, cb) {
    orm.createOne("project2_db", keys, values, function(res) {
      cb(res);
    });
  },
  updateone: function(keys, values, id, cb) {
    orm.updateOne("project2_db", keys, values, id, function(res) {
      cb(res);
    });
  }
};

// Export the database functions for the controller
module.exports = model;