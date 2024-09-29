'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('items', 'icon_url',{
      type: Sequelize.STRING(310),
      allowNull:true
     })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('items', 'icon_url');
  }
};
