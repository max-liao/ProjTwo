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
      //console.log(result);
      cb(result);
    });
  },
  selectOne: function(table, col, id, cb) {

    var queryString = "SELECT * FROM " + table + " WHERE ";
    queryString += col + " = " + id + ';';
    console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) throw err;

      cb(result);
    });
  },
  selectAlllocations: function(table, cb) {
    var queryString = "SELECT location FROM " + table + ";";
    connection.query(queryString, function(err, result) {
      if (err) throw err;
      cb(result);
    });
  },

  //Add row to table
  createOne: function(table, keys, values, cb) {

    for(var a = 0; a<values.length; a++){
      values[a] = "'" + values[a] + "'";
    }

    var queryString = "INSERT INTO " + table + " (" + keys + ") VALUES ("+ values +");";
    console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) throw err;
      console.log(result);
      cb(result);
    });
  },
  //Update value in row
  updateOne: function(table, keys, values, id, cb) {
    var tempstring = '';

     for(i = 0; i< keys.length; i++){
      tempstring += keys[i] + " = '"+values[i] +"'"
      if(i < keys.length-1){
        tempstring += ', ';
      }
    }
    var queryString = "UPDATE "+ table +" SET " + tempstring 
    queryString += " WHERE id= ";
    queryString += id+ ";";;

    console.log(queryString);

    connection.query(queryString, function(err, result) {
      if (err) throw err;
      console.log(result);
      cb(result);
    });
  }
};


module.exports = orm;
