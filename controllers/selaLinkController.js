const APIFeatures = require('../utils/apiFeatures');
const SelaLinks = require('../models/selaLinkModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const removeImage = require('../middlewares/removeImage');
const uploadImage = require('../middlewares/uploadImage');

const factory = require('./factoryFunctions');

exports.getAllSelaLinks = catchAsync(async (req, res, next) => {
  const { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  const data = await SelaLinks.findAll(query);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getSelaLink = catchAsync(async (req, res, next) => {
  const data = await SelaLinks.findByPk(req.params.id);

  if (!data) {
    return next(new AppError('No sela link found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.createSelaLink = factory.createOne(SelaLinks, 'לינק למערכת סל"ע נוסף בהצלחה');

exports.updateSelaLink = factory.updateOneById(SelaLinks, 'לא נמצא לינק עבור הID הזה');

exports.bulkUpdateSelaLink = catchAsync(async (req, res, next) => {
  const { body } = req;

  const queries = [];

  for (let i = 0; i < body.length; i++) {
    const row = { ...req.body[i] };
    delete row.id;

    queries.push(
      SelaLinks.update(row, {
        where: { id: req.body[i].id },
        validate: true,
        returning: true
      })
    );
  }
  const results = await Promise.all(queries);

  const data = results.map(updatedRow => {
    return updatedRow[0] === 0
      ? {
          status: 'fail',
          statusCode: 404,
          message: recordNotFoundMessage
        }
      : {
          status: 'success',
          data: updatedRow[1][0].dataValues
        };
  });

  res.status(200).json({
    status: 'success',
    data,
    message: 'הרשומות עודכנו בהצלחה'
  });
});

exports.deleteSelaLink = catchAsync(async (req, res, next) => {
  // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
  await removeImage(SelaLinks, req.params.id);
  const SelaLink = await SelaLinks.destroy({ where: { id: JSON.parse(req.params.id) } });

  if (!SelaLink) {
    return next(new AppError('No sela link found with that ID', 404));
  }

  res.status(202).json({
    status: 'success',
    data: null,
    message: 'לינק למערכת סל"ע נמחק בהצלחה'
  });
});
