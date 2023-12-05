const express = require('express');
const router = express.Router();
const path = require('path');

function inputController(req, res) {
  const filePath = path.join(__dirname,'..' ,'views', 'inputForm.html');
  res.sendFile(filePath);
}

module.exports = { inputController, router };
