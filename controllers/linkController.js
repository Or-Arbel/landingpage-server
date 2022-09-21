const Links = require('../models/linkModel');
const factory = require('./factoryFunctions');

exports.getAllLinks = factory.getAll(Links);
exports.getLink = factory.getOneById(Links, 'לא נמצא לינק עבור הID שנמסר');
exports.createLinks = factory.createOne(Links, 'הלינק נוסף בהצלחה');
exports.updateLink = factory.updateOneById(Links, 'לא נמצא לינק עבור הID שנמסר');
exports.bulkUpdateLink = factory.bulkUpdate(Links);
exports.deleteLink = factory.deleteOneOrMany(Links, 'לא נמצא לינק עם הID שנמסר', 'הלינק נמחק בהצלחה');
