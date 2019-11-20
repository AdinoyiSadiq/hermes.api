'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn(
        'messages',
        'senderId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: "id",
          }
        }
      ),
      await queryInterface.addColumn(
        'messages',
        'receiverId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: "id",
          }
        }
      ),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('messages', 'senderId'),
      await queryInterface.removeColumn('messages', 'receiverId'),
    ];
  }
};
