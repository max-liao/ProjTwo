var connection = require("./connection.js");

// Object Relational Mapper (ORM)

// The ?? signs are for swapping out table or column names
// The ? signs are for swapping out other values
// These help avoid SQL injection
// https://en.wikipedia.org/wiki/SQL_injection
var orm = {
  selectAll: function(table, cb) {
    var queryString = "SELECT * FROM " + table + ";";
    connection.query(queryString, function(err, result) {
      if (err) throw err;
      console.log(result);
      cb(result);
    });
  },
  createOne: function(table, keys, values, cb) {
    var queryString = "INSERT INTO " + table + " (" + keys + ") VALUES ("+ values +")";
    connection.query(queryString, function(err, result) {
      if (err) throw err;
      console.log(result);
      cb(result);
    });
  },
  updateOne: function(table, keys, values, id, cb) {
    var queryString = "UPDATE "+ table +" SET (" + keys + ") = (" + values + ")";
    queryString += " WHERE id= ";
    queryString += id;

    connection.query(queryString, function(err, result) {
      if (err) throw err;
      console.log(result);
      cb(result);
    });
  }
};

module.exports = orm;
