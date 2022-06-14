const router = require('express').Router();
const shobDevelopmentController = require('../controllers/shobDevelopmentController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(shobDevelopmentController.getAllShobDevelopments) // Retrieve all shob developments
  .post(shobDevelopmentController.createShobDevelopments) // Create a new shob development
  .patch(shobDevelopmentController.bulkUpdateShobDevelopment); // update many links

router
  .route('/:id')
  .get(shobDevelopmentController.getShobDevelopment) // Retrieve a single shob development by id
  .patch(shobDevelopmentController.updateShobDevelopment) // Update a shob development by id
  // .delete(authController.protect, authController.restrictTo('admin'), shobDevelopmentController.deleteShobDevelopment); // Delete a shob development by id
  .delete(shobDevelopmentController.deleteShobDevelopment); // Delete a shob development by id

module.exports = router;
