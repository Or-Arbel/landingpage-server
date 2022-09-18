const APIFeatures = require('../utils/apiFeatures');
// const Links = require('../models/linkModel');
const ReportUrl = require('../models/reportUrl');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReportUrls = catchAsync(async (req, res, next) => {
  const { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  const data = await ReportUrl.findAll(query);

  if (!data) {
    return next(new AppError('An error has occurred, could not fetch data', 500));
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

// exports.getReportUrl = catchAsync(async (req, res, next) => {
//   const data = await ReportUrl.findByPk(req.params.id);

//   if (!data) {
//     return next(new AppError(recordNotFoundMessage, 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data
//   });
// });

exports.createReportUrl = catchAsync(async (req, res, next) => {
  const data = await ReportUrl.create(req.body, { validate: true });

  res.status(201).json({
    status: 'success',
    data,
    message: 'הלינק נוסף בהצלחה'
  });
});

exports.updateReportUrl = catchAsync(async (req, res, next) => {
  const update = await ReportUrl.update(req.body, {
    where: { order: 0 },
    validate: true,
    returning: true
  });

  if (update[0] === 0) {
    return next(new AppError(recordNotFoundMessage, 404));
  }

  const data = update[1][0].dataValues;

  res.status(200).json({
    status: 'success',
    data
  });
});
