module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      min: 1,
    },
    image: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.ENUM,
      values: ['sent', 'delivered', 'read'],
      defaultValue: 'sent',
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    quote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  message.associate = (models) => {
    message.belongsTo(models.user, {
      foreignKey: 'senderId',
      as: 'sender',
    });
    message.belongsTo(models.user, {
      foreignKey: 'receiverId',
      as: 'receiver',
    });
    message.belongsTo(models.message, {
      foreignKey: 'quoteId',
      onDelete: 'set null',
    });
  };
  return message;
};
