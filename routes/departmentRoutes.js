const router = require('express').Router();
const departmentController = require('../controllers/departmentController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(departmentController.getAllDepartments) // Retrieve all Departments
  .post(departmentController.createDepartment) // Create a new department
  .patch(departmentController.bulkUpdateDepartment); // update many links
router
  .route('/:id')
  .get(departmentController.getDepartment) // Retrieve a single department by id
  .patch(departmentController.updateDepartment) // Update a department by id
  // .delete(authController.protect, authController.restrictTo('admin'), departmentController.deleteDepartment); // Delete a department by id
  .delete(departmentController.deleteDepartment); // Delete a department by id

module.exports = router;
