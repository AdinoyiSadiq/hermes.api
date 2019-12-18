'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn(
        'contacts',
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
        'contacts',
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
      await queryInterface.addColumn(
        'contacts',
        'actionUserId',
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
      queryInterface.removeColumn('contacts', 'userOneId'),
      queryInterface.removeColumn('contacts', 'userTwoId'),
      queryInterface.removeColumn('contacts', 'actionUserId')
    ]
  }
};
