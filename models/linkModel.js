const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'link', // model name
  {
    // fields:

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל מספר סידור - order' }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל שם' },
        len: {
          args: [2, 40],
          msg: 'שם הלינק חייב להכיל 2-40 תווים'
        }
      },
      set(name) {
        this.setDataValue('name', name.trim());
      }
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: [true], msg: 'הurl כבר קיים' },
      validate: {
        isUrl: { args: [true], msg: 'לינק לא תקין' },
        notNull: { msg: 'לינק חייב להכיל url' },
        min: { args: [9], msg: 'אורך הurl מינימום 9 תווים' }
      }
    }
  }
);
