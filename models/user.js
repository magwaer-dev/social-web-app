const db = require("../util/database");

module.exports = class User {
  constructor(id, username, email, password, registrationDate) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.registrationDate = registrationDate;
  }
  save() {
    return db.execute(
      "INSERT INTO users (username,password, email) VALUES (?,?,?)",
      [this.username, this.password, this.email]
    );
  }

  static checkIfUserExists(email) {
    return new Promise((resolve, reject) => {
      db.execute("SELECT COUNT(*) AS count FROM users WHERE email = ?", [email])
        .then(([rows]) => {
          const count = rows[0].count;
          console.log(count);
          resolve(count > 0);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static getUserByEmail(email) {
    return db
      .execute("SELECT * FROM users WHERE email = ?", [email])
      .then(([rows]) => {
        if (rows.length > 0) {
          // User found; return the user data
          return rows[0];
        }
        // User not found
        return null;
      })
      .catch((error) => {
        throw error;
      });
  }
};
