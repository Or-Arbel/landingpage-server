const DepartmentLinks = require('../models/departmentLinkModel');
const Departments = require('../models/departmentModel');
const factory = require('./factoryFunctions');

exports.getAllDepartmentLinks = factory.getAll(DepartmentLinks, [{ model: Departments }]);
exports.getDepartmentLink = factory.getOneById(DepartmentLinks, 'לא נמצא לינק עבור הID שנמסר');
exports.createDepartmentLinks = factory.createOne(DepartmentLinks, 'הלינק נוסף בהצלחה');
exports.updateDepartmentLink = factory.updateOneById(DepartmentLinks, 'לא נמצא לינק עבור הID שנמסר');
exports.bulkUpdateDepartmentLinks = factory.bulkUpdate(DepartmentLinks);
exports.deleteDepartmentLink = factory.deleteOneOrMany(DepartmentLinks, 'לא נמצא לינק עבור הID שנמסר', 'הלינק נמחק בהצלחה');
