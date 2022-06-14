const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

module.exports = sequelize.define(
  'shobDevelopment', // model name
  {
    // fields:
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'פיתוח חייב להכיל מספר סידור - order' }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'פיתוח חייב להכיל כותרת' },
        len: {
          args: [3, 40],
          msg: 'כותרת חייבת להכיל 3-40 תווים'
        }
      },
      set(title) {
        this.setDataValue('title', title.trim());
      }
    },

    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'פיתוח חייב להכיל כותרת משנה' },
        len: {
          args: [3, 150],
          msg: 'כותרת משנה חייבת להכיל 3-150 תווים'
        }
      },
      set(subTitle) {
        this.setDataValue('subTitle', subTitle.trim());
      }
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'פיתוח חייב להכיל תיאור' },
        len: {
          args: [3, 1500],
          msg: 'תיאור חייב להכיל 3-1500 תווים'
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
        notNull: { msg: 'פיתוח חייב להכיל url' },
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
        this.setDataValue('image', image && image.trim());
      }
    }
  }
);
