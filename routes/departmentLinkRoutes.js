const router = require('express').Router();
const authorize = require('../middlewares/authorization');

const {
  getAllDepartmentLinks,
  createDepartmentLinks,
  bulkUpdateDepartmentLinks,
  getDepartmentLink,
  updateDepartmentLink,
  deleteDepartmentLink
} = require('../controllers/departmentLinkController');

router
  .route('/')
  .get(getAllDepartmentLinks) // Retrieve all department links
  .post(authorize(), createDepartmentLinks) // Create a new department link
  .patch(authorize(), bulkUpdateDepartmentLinks); // update many links

router
  .route('/:id')
  .get(getDepartmentLink) // Retrieve a single department link by id
  .patch(authorize(), updateDepartmentLink) // Update a department link by id
  .delete(authorize(), deleteDepartmentLink); // Delete a department link by id

//old
// .delete(authController.protect, authController.restrictTo('admin'), departmentLinkController.deleteDepartmentLink); // Delete a department link by id

module.exports = router;
