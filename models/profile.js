module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    location: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  });
  profile.associate = (models) => {
    profile.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return profile;
};
