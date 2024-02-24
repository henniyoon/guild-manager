const World = require('../models/World.js');

async function getWorldId(worldName) {
    const world = await World.findOne({ where: { name: worldName } }, { attributes: ["id"] });
    return world.id;
}

async function getWorldName(worldId) {
    const world = await World.findOne({ where: { id: worldId } }, { attributes: ["name"] });
    return world.name;
}

module.exports = {
    getWorldId,
    getWorldName,
};