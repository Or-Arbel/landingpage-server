const router = require('express').Router();
const authorize = require('../middlewares/authorization');
const { upload } = require('../middlewares/upload');

const {
  getAllDepartments,
  createDepartment,
  bulkUpdateDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
router
  .route('/')
  .get(getAllDepartments) // Retrieve all Departments
  .post(authorize(), upload.single('image'), createDepartment) // Create a new department
  .patch(authorize(), upload.single('image'), bulkUpdateDepartment); // update many links
router
  .route('/:id')
  .get(getDepartment) // Retrieve a single department by id
  .patch(authorize(), upload.single('image'), updateDepartment) // Update a department by id
  .delete(authorize(), deleteDepartment); // Delete a department by id

//old
// .delete(authController.protect, authController.restrictTo('admin'), departmentController.deleteDepartment); // Delete a department by id

module.exports = router;
