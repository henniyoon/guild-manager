const express = require('express');
const dataFetcherRouter = express.Router();

const DataFetcherController = require('../controllers/dataFetcherController.js');


dataFetcherRouter.get('/Guild/:worldName/:guildName', DataFetcherController.getGuildController);
dataFetcherRouter.get('/GuildMembers/:worldName/:guildName', DataFetcherController.getCharacterController);
dataFetcherRouter.post('/GuildPage/:worldName/:guildName', DataFetcherController.dataFetcherController);

module.exports = dataFetcherRouter;