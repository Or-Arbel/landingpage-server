const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'singleFile', // model name
  {
    // fields:
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);
