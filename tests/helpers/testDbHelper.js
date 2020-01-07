import db from '../../models';

const { user, profile, message, contact, activeuser } = db;

module.exports = {
  async resetDB() {
    await activeuser.destroy({ truncate: true, cascade: true });
    await message.destroy({ truncate: true, cascade: true });
    await contact.destroy({ truncate: true, cascade: true });
    await profile.destroy({ truncate: true, cascade: true });
    await user.destroy({ truncate: true, cascade: true });
  },

  async closeDbConnection() {
    await db.sequelize.close();
  }
}