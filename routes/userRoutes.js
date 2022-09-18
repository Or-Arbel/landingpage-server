const express = require('express');
const userController = require('./../controllers/userController');

const { signup, login } = require('../controllers/authController');
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { forgotPass } = require('../controllers/resetPasswordController');
const router = express.Router();

//sign up new user :
router.post('/signup', signup);
//login user:
router.post('/login', login);
router.route('/').get(getAllUsers);

//forgot password - will not work in the orange network
// router.post('/forgotPassword', forgotPass);

router
  .route('/:id')
  .get(getUser) // get specific user
  .patch(updateUser) // update specific user
  .delete(deleteUser); // delete specific user

//old
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
// router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
// router.patch('/updateMe', authController.protect, userController.updateMe);

//get all users, will be used in admin panel (users management)

//not needed because we have signup function on /signup route
// .post(userController.createUser);
module.exports = router;
