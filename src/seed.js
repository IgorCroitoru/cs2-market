
const fs = require('fs')
async function getStickers(){

    const data = await fetch('https://bymykel.github.io/CSGO-API/api/en/stickers.json')
    const parsed = await data.json()
    parsed.forEach(e=>{
        if(e.crates?.length > 1) {
            console.log(e.market_hash_name)
            console.log(e.crates)
        }
    })
    // parsed.forEach(e=>{
    //     if(e.name !== e.market_hash_name && e.market_hash_name!== null){
    //         console.log(e.name)
    //     }
    // })
    return parsed
}
async function getStickerContainers(){
    const data = await fetch('https://www.steamwebapi.com/steam/api/cs/containers?key=Y4TRUJO9DD87Z46H&type=sticker')
    const parsed = await data.json()
    fs.writeFileSync('sticker_collection.json', JSON.stringify(parsed,null,3))
}
async function getCrates() {
    const data = await fetch('https://bymykel.github.io/CSGO-API/api/en/crates.json');
    const parsed = await data.json();
    
    let crates = {}; // Object to store crates indexed by e.id

    parsed.forEach(e => {
        if(e.name !== e.market_hash_name && e.market_hash_name!== null){
            console.log(e.name)
        }
        if (e.type === 'Sticker Capsule' && !crates[e.id]) {
            // Add crate if it isn't already in the crates object
            crates[e.id] = {
                name: e.name,
                id: e.id
            };
        }
    });

     console.log(crates);
}

const getDopplerPhase = (paintIndex) => {
    const dopplerPhases = {
        // Doppler
        415: "Ruby",
        416: "Sapphire",
        417: "Black Pearl",
        418: "Phase 1",
        419: "Phase 2",
        420: "Phase 3",
        421: "Phase 4",

        // Gamma Doppler
        568: "Emerald",
        569: "Phase 1",
        570: "Phase 2",
        571: "Phase 3",
        572: "Phase 4",

        // Doppler (Butterfly Knife, Shadow Daggers)
        617: "Black Pearl",
        618: "Phase 2",
        619: "Sapphire",

        // Doppler (Talon Knife)
        852: "Phase 1",
        853: "Phase 2",
        854: "Phase 3",
        855: "Phase 4",

        // Gamma Doppler (Glock-18)
        1119: "Emerald",
        1120: "Phase 1",
        1121: "Phase 2",
        1122: "Phase 3",
        1123: "Phase 4",
    };

    return dopplerPhases?.[paintIndex];
};

// getCrates()
// getStickers()
function generateItemSlug(skinName) {
    return skinName
        .toLowerCase() // Convert to lowercase
        .replace(/\|/g, '') // Remove the pipe character
        .replace(/[()]/g, '') // Remove parentheses
        .replace(/[^\w\s★&-]/g, '') // Remove special characters except ★ and hyphen
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
  }
// console.log(generateItemSlug('StatTrak™ Glock-18 | Moonrise (Field-Tested)'))
async function getBp() {
    const params = new URLSearchParams({
        key: 'Y4TRUJO9DD87Z46H'
    })
    try {
      const data = await fetch(`https://www.steamwebapi.com/steam/api/items?key=Y4TRUJO9DD87Z46H`);
     fs.writeFileSync('data.json',  JSON.stringify(await data.json(),null,4))
      
    } catch (e) {
      console.log(e);
    }
  }
  
//   getBp();

const readJson = ()=> {
    const data = JSON.parse(fs.readFileSync('data.json',{encoding: 'utf-8', json: true}))
    data.forEach(i=>{
        if(i.markethashname !== i.marketname){
            console.log(i.marketname + ',' + i.markethashname)
        }
    })
}
// readJson()
// getCrates()
// getStickerContainers()
const getLongestLink = () => {
    const data = JSON.parse(fs.readFileSync('data.json',{encoding: 'utf-8', json: true}))
    let longestLink = '';

    // Iterate through each item in the data
    data.forEach(item => {
        // Check if the item has an 'itemimage' property
        if (item.itemimage) {
            let image = item.itemimage.split('economy/image/')[1];
            // Compare the current item's image link length with the longest found so far
            if (image.length > longestLink.length) {
                longestLink = image; // Update longestLink if the current one is longer
            }
        }
    });
    console.log(longestLink.length)
    console.log(longestLink)
}

getLongestLink()
// getStickers()