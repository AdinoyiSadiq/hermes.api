module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'the first name can only contain letters and numbers',
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'the first name can only contain letters and numbers',
        },
      },
    },
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
