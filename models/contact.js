module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define('contact', {
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  contact.associate = (models) => {
    contact.belongsTo(models.user, {
      foreignKey: 'userOneId',
      as: 'userOne',
    });
    contact.belongsTo(models.user, {
      foreignKey: 'userTwoId',
      as: 'userTwo',
    });
    contact.belongsTo(models.user, {
      foreignKey: 'actionUserId',
      as: 'actionUser',
    });
  };
  return contact;
};
