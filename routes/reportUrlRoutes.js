const router = require('express').Router();
const authorize = require('../middlewares/authorization');
const { getAllReportUrls, createReportUrl, updateReportUrl } = require('../controllers/reportUrlController');

router
  .route('/')
  .get(getAllReportUrls)
  .post(authorize(), createReportUrl) // Create a new report url
  .patch(authorize(), updateReportUrl); // update report url

module.exports = router;
