let connection = require("../config/db");
let moment = require("../config/moment");

class Client {
  constructor(row) {
    this.row = row;
  }

  get id() {
    return this.row.id;
  }

  get login() {
    return this.row.login;
  }

  get mdp() {
    return this.row.mdp;
  }

  get created_at() {
    return moment(this.row.created_at);
  }

  static create(login, mdp, cb) {
    connection.query(
      "INSERT INTO client SET login = ? , mdp = ? , created_at = ?",
      [login, mdp, new Date()],
      (err, result) => {
        if (err) throw err;
        cb(result);
      }
    );
  }

  static findbyId(id, cb) {
    connection.query(
      "SELECT * FROM client WHERE id = ? LIMIT 1",
      [id],
      (err, rows) => {
        if (err) throw err;
        cb(new Client(rows[0]));
      }
    );
  }

  static findByLoginAndMdp(login, mdp, cb) {
    connection.query(
      "SELECT * FROM client WHERE login = ? AND mdp = ? LIMIT 1",
      [login, mdp],
      (err, rows) => {
        if (!Array.isArray(rows) || rows.length == 0) {
          cb(undefined);
        } else {
          cb(new Client(rows[0]));
        }
      }
    );
  }

  static findByLogin(login, cb) {
    connection.query(
      "SELECT * FROM client WHERE login = ? LIMIT 1",
      [login],
      (err, rows) => {
        if (!Array.isArray(rows) || rows.length == 0) {
          cb(undefined);
        } else {
          cb(new Client(rows[0]));
        }
      }
    );
  }
}

module.exports = Client;
