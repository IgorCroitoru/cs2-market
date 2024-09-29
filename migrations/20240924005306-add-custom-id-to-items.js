'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('items', 'custom_id',{
    type: Sequelize.SMALLINT,
    allowNull:true
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('items', 'custom_id')
  }
};
