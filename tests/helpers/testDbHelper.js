import db from '../../models';

const { user, profile } = db;

module.exports = {
  async resetDB() {
    await user.destroy({ truncate: true, cascade: true });
    await profile.destroy({ truncate: true, cascade: true });
  },

  async closeDbConnection() {
    await db.sequelize.close();
  }
}