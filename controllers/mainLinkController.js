const MainLinks = require('../models/mainLinkModel');
const factory = require('./factoryFunctions');

exports.getAllMainLinks = factory.getAll(MainLinks);
exports.getMainLink = factory.getOneById(MainLinks, 'לא נמצא לינק עבור הID שנמסר');
exports.createMainLinks = factory.createOne(MainLinks, 'הלינק נוסף בהצלחה');
exports.updateMainLink = factory.updateOneById(MainLinks, 'לא נמצא לינק לעדכון');
exports.bulkUpdateMainLink = factory.bulkUpdate(MainLinks);
exports.deleteMainLink = factory.deleteOneOrMany(MainLinks, 'לא נמצא לינק עבור הID שנמסר', 'הלינק נמחק בהצלחה');
