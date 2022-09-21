const Departments = require('../models/departmentModel');
const DepartmentLinks = require('../models/departmentLinkModel');
const factory = require('./factoryFunctions');

exports.getAllDepartments = factory.getAll(Departments, [
  {
    model: DepartmentLinks,
    required: false
  }
]);

exports.getDepartment = factory.getOneById(Departments, 'לא נמצאה מחלקה עבור הID שנמסר');
exports.createDepartment = factory.createOne(Departments, 'המחלקה נוספה בהצלחה');
exports.updateDepartment = factory.updateOneById(Departments, 'לא נמצאה מחלקה עבור הID שנמסר');
exports.bulkUpdateDepartment = factory.bulkUpdate(Departments);
exports.deleteDepartment = factory.deleteOneOrMany(Departments, 'לא נמצאה מחלקה עבור הID שנמסר', 'המחלקה נמחקה בהצלחה');
