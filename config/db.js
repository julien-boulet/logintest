const mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "test"
});

connection = {
  query: function() {
    var queryArgs = Array.prototype.slice.call(arguments);

    pool.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      if (connection) {
        var q = connection.query.apply(connection, queryArgs);
        q.on("end", function() {
          connection.release();
        });
      }
    });
  }
};

module.exports = connection;
