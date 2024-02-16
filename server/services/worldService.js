const World = require('../models/World.js');

async function getWorldId(worldName) {
    const world = await World.findOne({ where: { name: worldName } });
    return world.id;
}

module.exports = {
    getWorldId,
};