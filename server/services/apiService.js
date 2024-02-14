const axios = require('axios');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);

const API_KEY = config.apiKey;

async function getApiResponse(url) {
    try {
        const response = await axios.get(url, { headers: { "x-nxopen-api-key": API_KEY } });
        return response.data;
    } catch (error) {
        console.error('API 조회 에러:', error);
        // throw new Error('서버 에러');
    }
}

module.exports = {
    getApiResponse,
};
