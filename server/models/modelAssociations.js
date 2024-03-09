const User = require('./User.js');
const Guild = require('./Guild.js');
const World = require('./World.js');
const Character = require('./Character.js');

User.belongsTo(Guild, { foreignKey: 'guild_id', as: 'guild' });
Guild.hasMany(User, { foreignKey: 'guild_id', as: 'members' });

Guild.belongsTo(World, { foreignKey: 'world_id', as: 'world' });
World.hasMany(Guild, { foreignKey: 'world_id' });

Character.belongsTo(Guild, { foreignKey: 'guild_id', as: 'guild' });
Guild.hasMany(Character, { foreignKey: 'guild_id', as: 'characters' });