const pool = require('../utils/pool');

module.exports = class Secret {
  title;
  description;
  created_at;

  constructor(row) {
    this.title = row.title;
    this.description = row.description;
    this.created_at = row.created_at;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM secrets');

    return rows.map((row) => new Secret(row));
  }
}
