const router = require('express').Router();
const authorize = require('../middlewares/authorization');
const { getAllLinks, createLinks, bulkUpdateLink, getLink, updateLink, deleteLink } = require('../controllers/linkController');

router
  .route('/')
  .get(getAllLinks) // Retrieve all Links
  .post(authorize(), createLinks) // Create a new Link
  .patch(authorize(), bulkUpdateLink); // update many links

router
  .route('/:id')
  .get(getLink) // Retrieve a single Link with id
  .patch(authorize(), updateLink) // Update a Link with id
  .delete(authorize(), deleteLink); // Delete a Link with id

//old
// .delete(authController.protect, authController.restrictTo('admin'), linkController.deleteLink); // Delete a Link with id

module.exports = router;
