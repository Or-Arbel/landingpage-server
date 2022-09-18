const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'reportUrl', // model name
  {
    // fields:
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'נא להזין מספר סידור - order' }
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      isUrl: true,
      validate: {
        notNull: { msg: 'שדה url הוא שדה חובה' },
        isUrl: { args: [true], msg: 'לינק לא תקין' }
      },
      set(url) {
        this.setDataValue('url', url.trim());
      }
    }
  }
);
