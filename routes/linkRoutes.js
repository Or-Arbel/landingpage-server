const router = require('express').Router();
const linkController = require('../controllers/linkController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(
    // authController.protect,
    linkController.getAllLinks
  ) // Retrieve all Links
  .post(linkController.createLinks) // Create a new Link
  .patch(linkController.bulkUpdateLink); // update many links

router
  .route('/:id')
  .get(linkController.getLink) // Retrieve a single Link with id
  .patch(linkController.updateLink) // Update a Link with id
  // .delete(authController.protect, authController.restrictTo('admin'), linkController.deleteLink); // Delete a Link with id
  .delete(linkController.deleteLink); // Delete a Link with id

module.exports = router;
