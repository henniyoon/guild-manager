const { Sequelize } = require('sequelize');
const SubMember = require('../models/subMemberModel');

async function getAllSubMembers() {
    try {
        return await SubMember.findAll({ attributes: ['name', 'main_name'], raw: true})
    } catch (error) {
        console.error('데이터 조회 에러:', error);
        throw error;
    }
}

module.exports = {
    getAllSubMembers,
  };