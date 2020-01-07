'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn(
        'activeusers',
        'userOneId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: "id",
          },
          onDelete: 'SET NULL',
        }
      ),
      await queryInterface.addColumn(
        'activeusers',
        'userTwoId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: "id",
          },
          onDelete: 'SET NULL',
        }
      ),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('activeusers', 'userOneId'),
      queryInterface.removeColumn('activeusers', 'userTwoId'),
    ];
  }
};
