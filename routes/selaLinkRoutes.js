const router = require('express').Router();
const authorize = require('../middlewares/authorization');
const { upload } = require('../middlewares/upload');

const {
  getAllSelaLinks,
  createSelaLinks,
  createSelaLink, //single ! not bulkCreate
  bulkUpdateSelaLink,
  getSelaLink,
  updateSelaLink,
  deleteSelaLink
} = require('../controllers/selaLinkController');

router
  .route('/')
  .get(getAllSelaLinks) // Retrieve all sela links
  .post(authorize(), upload.single('image'), createSelaLink) // Create a new sela link
  .patch(authorize(), bulkUpdateSelaLink); // update many links

router
  .route('/:id')
  .get(getSelaLink) // Retrieve a single sela link by id
  .patch(authorize(), upload.single('image'), updateSelaLink) // Update a sela link by id
  .delete(authorize(), deleteSelaLink); // Delete a sela link by id

//old
// .delete(authController.protect, authController.restrictTo('admin'), SelaLinkController.deleteSelaLink); // Delete a sela link by id

module.exports = router;
