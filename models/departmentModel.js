const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'department', // model name
  {
    // fields:
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'מחלקה חייבת להכיל מספר סידור - order' }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'מחלקה חייבת להכיל שם' },
        len: {
          args: [3, 40],
          msg: 'שם המחלקה חייב להכיל 3-40 תווים'
        }
      },
      set(name) {
        this.setDataValue('name', name.trim());
      }
    }
  }
);
