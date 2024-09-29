'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      const data = await fetch(`https://www.steamwebapi.com/steam/api/items?key=Y4TRUJO9DD87Z46H`);
      const items = await data.json()
      await queryInterface.sequelize.query(`
        UPDATE items
        SET icon_url = CASE
         ${items.map(item=> `WHEN market_hash_name = '${item.markethashname.replace(/'/g, "''")}' THEN '${item.itemimage.split('economy/image/')[1]}'`).join(' ')}
         END;
        `)
    }catch(e){
      console.log('Error seeding items icon_urls',e)
    }
    
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.sequelize.query(`
    UPDATE items SET icon_url = null;
    `)
  }
};
