const express = require('express');
const router = express.Router();
const { findNobleLimit } = require('../services/findNobleLimit');

async function NobleLimitController(req, res) {
  try {
    const results = await findNobleLimit();

    // main_name만 추출
    const mainNames = results.map((result) => result.main_name);

    // EJS 템플릿 렌더링
    res.render('nobleLimit', { mainNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
}

module.exports = { NobleLimitController, router };
