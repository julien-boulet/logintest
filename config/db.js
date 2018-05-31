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

    pool.getConnection(function(err, conn) {
      if (err) {
        throw err;
      }
      if (conn) {
        var q = conn.query.apply(conn, queryArgs);
        q.on("end", function() {
          conn.release();
        });
      }
    });
  }
};

module.exports = connection;
