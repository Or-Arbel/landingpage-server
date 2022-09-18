const router = require('express').Router();
const authorize = require('../middlewares/authorization');
const {
  getAllMainLinks,
  createMainLinks,
  bulkUpdateMainLink,
  getMainLink,
  updateMainLink,
  deleteMainLink
} = require('../controllers/mainLinkController');
const { upload } = require('../middlewares/upload');

router
  .route('/')
  .get(getAllMainLinks) // Retrieve all Main Links
  .post(authorize(), upload.single('image'), createMainLinks) // Create a new Main Link
  .patch(authorize(), bulkUpdateMainLink); // update many Main links

router
  .route('/:id')
  .get(getMainLink) // Retrieve a single Main Link with id
  .patch(authorize(), upload.single('image'), updateMainLink) // Update a Main Link with id
  .delete(authorize(), deleteMainLink); // Delete a Main Link with id

module.exports = router;
