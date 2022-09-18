const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendResetPassEmail');

exports.forgotPass = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: ['email', 'id', 'password']
  });
  if (!email || !user) {
    return next(new AppError('User not found for that email', 404));
  }

  const payload = { email, id: user.id };
  //secret key that includes user's current password, to create one-time link
  const secret = process.env.JWT_PASSWORD_RESET_KEY + user.password;
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  const link = `${process.env.HOST_URL}/reset-password/${user.id}/${token}`;

  //send the link to the user's email
  sendEmail(email, link);

  res.status(200).json({
    status: 'success',
    message: 'Password reset link has been sent to your email ',
    user,
    email,
    link
  });
});
