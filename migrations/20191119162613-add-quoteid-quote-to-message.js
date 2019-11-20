'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn(
        'messages',
        'quoteId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'messages',
            key: "id",
          },
          onDelete: 'SET NULL',
        }
      ),
      await queryInterface.addColumn(
        'messages',
        'quote',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        }
      ),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('messages', 'quoteId'),
      queryInterface.removeColumn('messages', 'quote')
    ]
  }
};
