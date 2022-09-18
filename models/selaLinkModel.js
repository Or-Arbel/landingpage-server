const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'selaLink', // model name
  {
    // fields:
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל מספר סידור - order' }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל כותרת' },
        len: {
          args: [3, 40],
          msg: 'כותרת חייבת להכיל 3-40 תווים'
        }
      },
      set(title) {
        this.setDataValue('title', title.trim());
      }
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'לינק חייב להכיל תיאור' },
        len: {
          args: [3, 1500],
          msg: 'תיאור חייב להכיל 3-1500 תו וים'
        }
      },
      set(description) {
        this.setDataValue('description', description.trim());
      }
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
      isUrl: true,
      validate: {
        notNull: { msg: 'לינק חייב להכיל url' },
        isUrl: { args: [true], msg: 'לינק לא תקין' }
      },
      set(url) {
        this.setDataValue('url', url.trim());
      }
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
      set(image) {
        this.setDataValue('image', image ?? null);
      }
    }
  }
);
