'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{

      const response = await fetch('https://bymykel.github.io/CSGO-API/api/en/stickers.json')
      const items = await response.json(); 

      await queryInterface.sequelize.query(
        `
        UPDATE items
        SET custom_id = CASE
        ${items.map(item=> `WHEN market_hash_name = '${item.name.replace(/'/g, "''")}' THEN ${Number(item.id.replace("sticker-", ""))}`).join(' ')}
        END
        WHERE market_hash_name IN (${items.map(item => `'${item.name.replace(/'/g, "''")}'`).join(', ')});
        `
      )

    }catch(e){
      console.log('Seeding stickers custom-id error', e)
    }
   
  },

  async down (queryInterface, Sequelize) {
    // In the down method, you can revert the changes by setting steam_id to null, or based on your requirement
    await queryInterface.sequelize.query(`
      UPDATE items SET custom_id = NULL WHERE steam_id IS NOT NULL;
    `);
  }
};
