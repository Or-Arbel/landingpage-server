const router = require('express').Router();
const authorize = require('../middlewares/authorization');
const { upload } = require('../middlewares/upload');

const {
  getAllShobDevelopments,
  createShobDevelopments,
  createShobDevelopment, //single ! not bulkCreate
  bulkUpdateShobDevelopment,
  getShobDevelopment,
  updateShobDevelopment,
  deleteShobDevelopment
} = require('../controllers/shobDevelopmentController');

router
  .route('/')
  .get(getAllShobDevelopments) // Retrieve all shob developments
  .post(authorize(), upload.single('image'), createShobDevelopment) // Create a new shob development
  .patch(authorize(), bulkUpdateShobDevelopment); // update many links

router
  .route('/:id')
  .get(getShobDevelopment) // Retrieve a single shob development by id
  .patch(authorize(), upload.single('image'), updateShobDevelopment) // Update a shob development by id
  .delete(authorize(), deleteShobDevelopment); // Delete a shob development by id

//old
// .delete(authController.protect, authController.restrictTo('admin'), shobDevelopmentController.deleteShobDevelopment); // Delete a shob development by id

module.exports = router;
