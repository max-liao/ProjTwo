// Dependencies
// =============================================================
// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var model = {
  selectall: function(cb) {
    orm.selectAll("food_truck", function(res) {
      cb(res);
    });
  },
  selectOne: function(table, col, id, cb) {
    orm.selectOne(table, col, id, function(res) {
      cb(res);
    });
  },
  selectlocations: function(cb) {
    orm.selectAlllocations("food_truck", function(res) {
      cb(res);
    });
  },
  createone: function(keys, values, cb) {
    orm.createOne("food_truck", keys, values, function(res) {
      cb(res);
    });
  },
  updateone: function(keys, values, id, cb) {
    orm.updateOne("food_truck", keys, values, id, function(res) {
      cb(res);
    });
  }
};

// Export the database functions for the controller
module.exports = model;