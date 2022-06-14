const crypto = require('crypto');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./../server');
// const validator = require('validator');

const User = sequelize.define(
  'user', // model name
  {
    // fields:

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide a name' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: [true], msg: 'User with this email already exists' },
      validate: {
        notNull: { msg: 'Please provide a valid email' },
        isEmail: { args: [true], msg: 'Please provide a valid email' }
      },
      set(email) {
        this.setDataValue('email', email.toLowerCase());
      }
    },
    photo: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin']],
          msg: 'User role must be user or admin'
        }
      }
      // type: DataTypes.STRING,
      // defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide a password' },
        len: {
          args: [8],
          msg: 'A user password must have at least 8 characters'
        }
      }
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please confirm your password' },
        isConfirmedPassword(passwordConfirm) {
          if (passwordConfirm === this.password) return true;
          throw new Error('Passwords are not the same!');
        }
      }
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE
  }
);

// 1) Sequelize instance methods.
User.prototype.isModified = function(fieldName) {
  return this._previousDataValues[fieldName] !== this.dataValues[fieldName];
};

User.prototype.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

User.prototype.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

User.prototype.hidePassword = function() {
  this.password = null;
  this.passwordConfirm = null;
};
// 2) Sequelize Hooks.

User.afterFind(users => {
  // dont send passwords on get requests
  if (!Array.isArray(users)) return;

  users.map(user => {
    // delete user.dataValues.active;
    delete user.dataValues.password;
    delete user.dataValues.passwordConfirm;
    return user;
  });
});

User.afterValidate(async function(user) {
  // Delete passwordConfirm field
  user.passwordConfirm = '';
});

User.beforeSave(async function(user) {
  // Only run this function if password was actually modified
  if (!user.isModified('password')) return;

  // Hash the password with cost of 12
  user.password = await bcrypt.hash(user.password, 12);
});

User.beforeSave(async function(user) {
  // Only run this function if password was actually modified and user is not new record
  if (!user.isModified('password') || user.isNewRecord) return;

  user.passwordChangedAt = Date.now() - 1000;
});

User.afterSave(newUser => {
  delete newUser.dataValues.password;
  delete newUser.dataValues.passwordConfirm;
});

module.exports = User;
