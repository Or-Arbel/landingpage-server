const ReportUrl = require('../models/reportUrl');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./factoryFunctions');

exports.getAllReportUrls = factory.getAll(ReportUrl);

exports.createReportUrl = factory.createOne(ReportUrl, 'הלינק נוסף בהצלחה');

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
