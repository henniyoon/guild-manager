const express = require('express');
const router = express.Router();
const nobleLimit = require('../models/nobleLimit');

async function addMemberController(req, res) {
  const { names } = req.body;

  if (!names || names.length === 0) {
    return res.status(400).json({ error: '이름은 필수입니다.' });
  }

  try {
    const namesArray = JSON.parse(names);

    for (const name of namesArray) {
      await nobleLimit.create({ name: name.trim() });
    }

    res.status(200).json({ message: '멤버가 성공적으로 추가되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '내부 서버 오류' });
  }
}

module.exports = { addMemberController, router };
