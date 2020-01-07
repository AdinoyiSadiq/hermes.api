module.exports = (sequelize, DataTypes) => {
  const activeuser = sequelize.define('activeuser', {
    userOneStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userTwoStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  activeuser.associate = (models) => {
    activeuser.belongsTo(models.user, {
      foreignKey: 'userOneId',
      as: 'userOne',
    });
    activeuser.belongsTo(models.user, {
      foreignKey: 'userTwoId',
      as: 'userTwo',
    });
  };
  return activeuser;
};
