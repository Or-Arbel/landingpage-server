const router = require('express').Router();
const departmentLinkController = require('../controllers/departmentLinkController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(departmentLinkController.getAllDepartmentLinks) // Retrieve all department links
  .post(departmentLinkController.createDepartmentLinks) // Create a new department link
  .patch(departmentLinkController.bulkUpdateDepartmentLinks); // update many links

router
  .route('/:id')
  .get(departmentLinkController.getDepartmentLink) // Retrieve a single department link by id
  .patch(departmentLinkController.updateDepartmentLink) // Update a department link by id
  // .delete(authController.protect, authController.restrictTo('admin'), departmentLinkController.deleteDepartmentLink); // Delete a department link by id
  .delete(departmentLinkController.deleteDepartmentLink); // Delete a department link by id

module.exports = router;
