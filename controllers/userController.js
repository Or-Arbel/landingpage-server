const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) {
//       newObj[el] = obj[el];
//     }
//   });
//   return newObj;
// };

//get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'passwordConfirm', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] }
  });
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users
  });
});

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 1) Create error if user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
//   }

//   // 2) Filtered out unwanted fields names that are not allowed to be updated
//   const filteredBody = filterObj(req.body, 'name', 'email');

//   // 3) Update user document
//   const updatedUser = await User.findByPk(req.user.id);
//   await updatedUser.update(filteredBody, { validate: false });

//   updatedUser.hidePassword();

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser
//     }
//   });
// });

exports.getUser = catchAsync(async (req, res, next) => {
  // const data = await User.findByPk(req.params.id);
  const data = await User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['password', 'passwordConfirm', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'] }
  });

  if (!data) {
    return next(new AppError('Could not find user for that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

//update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.update(req.body, {
    where: { id: +req.params.id },
    individualHooks: true
  });

  //no rows updated
  if (updatedUser[0] == 0) {
    return next(new AppError('Could not find user for that id', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully!'
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  console.log('hi from delete');
  const userDeleted = await User.destroy({ where: { id: +req.params.id } });
  console.log(userDeleted);
  if (userDeleted === 1) {
    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } else {
    return next(new AppError('Something went wrong, could no delete user', 500));
  }
});
