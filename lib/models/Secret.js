const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  created_at;
//   #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.created_at = row.created_at;
    // this.#passwordHash = row.password_hash;
  }

  static async 
}
