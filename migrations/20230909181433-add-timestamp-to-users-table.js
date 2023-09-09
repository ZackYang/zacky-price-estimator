'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'createdAt',
      {
        type: Sequelize.DATE,
        allowNull: false
      }
    );

    queryInterface.addColumn(
      'Users',
      'updatedAt',
      {
        type: Sequelize.DATE,
        allowNull: false
      }
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Users',
      'createdAt'
    );

    queryInterface.removeColumn(
      'Users',
      'updatedAt'
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
