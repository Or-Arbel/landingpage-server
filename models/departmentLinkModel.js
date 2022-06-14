const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'departmentLink', // model name
  {
    // fields:
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל מספר סידור - order' }
      }
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להיות משוייך למחלקה' }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל שם' }
      }
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
      isUrl: true,
      validate: {
        isUrl: { args: [true], msg: 'לינק לא תקין' },
        notNull: { msg: 'לינק חייב להכיל url' }
      }
    }
  }
);
