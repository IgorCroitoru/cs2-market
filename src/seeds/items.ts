import { ItemCreationAttr } from "src/item/item.model";
import * as fs from 'fs'
import { ItemService } from "src/item/item.service";
export async function seedCsItems(itemService: ItemService) {
    try {
        const data = JSON.parse(fs.readFileSync('data.json', { encoding: 'utf-8' }));
        const items: ItemCreationAttr[] = []; // Populate this array with data from your JSON file
        data.forEach((e)=>{
          items.push({market_hash_name:e.markethashname})
        })
        // Use bulk upsert to add items
        await itemService.bulkUpsert(items);

        // Query to find duplicate slugs
        const duplicates = await itemService.itemModel.findAll({
            attributes: ['slug', [itemService.itemModel.sequelize.fn('COUNT', itemService.itemModel.sequelize.col('slug')), 'count']],
            group: ['slug'],
            having: itemService.itemModel.sequelize.where(itemService.itemModel.sequelize.fn('COUNT', itemService.itemModel.sequelize.col('slug')), '>', 1),
        });

        // Update duplicate slugs
        for (const duplicate of duplicates) {
            const slug = duplicate.slug;

            // Find all items with this duplicate slug
            const itemsToUpdate = await itemService.itemModel.findAll({
                where: { slug },
            });

            // Iterate over the found items and update their slugs
            itemsToUpdate.forEach(async (item, index) => {
                const newSlug = `${slug}-${index + 1}`; // Generate new slug with index (1-based)
                item.slug = newSlug; // Assign new slug
                await item.save(); // Save the updated item
            });
        }
      
        console.log('Items seeding complete!');
    } catch (error) {
        console.error('Items seeding failed:', error);
    }
  }