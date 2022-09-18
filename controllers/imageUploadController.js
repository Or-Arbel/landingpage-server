const SingleFile = require('../models/singleFileModel');

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
};

const singleFileUpload = async (req, res, next) => {
  console.log(req.file);
  try {
    const file = new SingleFile({
      fileName: req.file.originalname,
      filePath: req.file.path.replace('\\', '/'),
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
    });
    await file.save();
    // res.status(201).send(message: 'File Uploaded Successfully');
    res.status(200).json({
      message: 'File Uploaded Successfully',
      file
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getallSingleFiles = async (req, res, next) => {
  try {
    const files = await SingleFile.findAll();
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  singleFileUpload,
  getallSingleFiles
};
