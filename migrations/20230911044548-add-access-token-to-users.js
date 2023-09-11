'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn(
      'Users',
      'accessToken',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    queryInterface.addIndex('Users', ['accessToken']);
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn(
      'Users',
      'accessToken'
    );
  }
};
