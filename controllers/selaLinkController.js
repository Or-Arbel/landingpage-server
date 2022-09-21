const SelaLinks = require('../models/selaLinkModel');
const factory = require('./factoryFunctions');

exports.getAllSelaLinks = factory.getAll(SelaLinks);
exports.getSelaLink = factory.getOneById(SelaLinks, 'לא נמצא לינק עבור הID שנמסר');
exports.createSelaLink = factory.createOne(SelaLinks, 'לינק למערכת סל"ע נוסף בהצלחה');
exports.updateSelaLink = factory.updateOneById(SelaLinks, 'לא נמצא לינק עבור הID הזה');
exports.bulkUpdateSelaLink = factory.bulkUpdate(SelaLinks);
exports.deleteSelaLink = factory.deleteOneOrMany(SelaLinks, 'לא נמצא לינק עבור הID שנמסר', 'הלינק נמחק בהצלחה');
