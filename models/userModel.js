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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide a password' },
        len: {
          args: [8],
          msg: 'A user password must have at least 8 characters'
        }
      },
      select: false
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
      },
      select: false
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

// check if the inserted password in login is equal to saved password in db
// returns true if equal and false if not
User.prototype.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//needs to be fixed
User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//not in use
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

// 2) Sequelize Hooks:

//function that encrypts password before it is saved to db (on signup)
User.beforeSave(async function(user) {
  // Only run this function if password was actually modified
  if (!user.isModified('password')) return;

  // Hash the password with cost of 12
  user.password = await bcrypt.hash(user.password, 12);
  // Hide confirmPassword value
  user.passwordConfirm = '';
  // Update "password changed at" time
  user.passwordChangedAt = Date.now() - 1000;
});

module.exports = User;
