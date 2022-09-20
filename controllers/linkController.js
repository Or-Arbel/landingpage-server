const APIFeatures = require('../utils/apiFeatures');
const Links = require('../models/linkModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./factoryFunctions');

exports.getAllLinks = catchAsync(async (req, res, next) => {
  const { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  const data = await Links.findAll(query);

  if (!data) {
    return next(new AppError('An error has occurred, could not fetch data', 500));
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getLink = factory.getOneById(Links, 'לא נמצא לינק עבור הID שנמסר');

exports.createLinks = factory.createOne(Links, 'הלינק נוסף בהצלחה');

exports.updateLink = factory.updateOneById(Links, 'לא נמצא לינק עבור הID שנמסר');

exports.bulkUpdateLink = catchAsync(async (req, res, next) => {
  const { body } = req;

  const queries = [];

  for (let i = 0; i < body.length; i++) {
    const row = { ...req.body[i] };
    delete row.id;

    queries.push(
      Links.update(row, {
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

exports.deleteLink = catchAsync(async (req, res, next) => {
  // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
  const link = await Links.destroy({ where: { id: JSON.parse(req.params.id) } });

  if (!link) {
    return next(new AppError(recordNotFoundMessage, 404));
  }

  res.status(202).json({
    status: 'success',
    data: null,
    message: 'הלינק נמחק בהצלחה'
  });
});
