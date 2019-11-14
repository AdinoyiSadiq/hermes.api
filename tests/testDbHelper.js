import db from '../models';

const { user } = db;

module.exports = {
  async resetDB() {
    await user.destroy({ truncate: true, cascade: true });
  },

  closeDbConnection() {
    db.sequelize.close();
  }
}