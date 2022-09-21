const ShobDevelopments = require('../models/shobDevelopmentModel');
const factory = require('./factoryFunctions');

exports.getAllShobDevelopments = factory.getAll(ShobDevelopments);
exports.getShobDevelopment = factory.getOneById(ShobDevelopments, 'לא נמצא פיתוח שו"ב עבור הID שנמסר');
exports.createShobDevelopment = factory.createOne(ShobDevelopments, 'פיתוח המעבדה נוסף בהצלחה');
exports.updateShobDevelopment = factory.updateOneById(ShobDevelopments, 'לא נמצא פיתוח שו"ב עבור הID שנמסר');
exports.bulkUpdateShobDevelopment = factory.bulkUpdate(ShobDevelopments);
exports.deleteShobDevelopment = factory.deleteOneOrMany(ShobDevelopments, 'לא נמצא פיתוח מעבדה עבור הID שנמסר', 'פיתוח המעבדה נמחק בהצלחה');
