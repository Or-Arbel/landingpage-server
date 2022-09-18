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

module.exports = uploadImage = async file => {
  const newImage = new SingleFile({
    fileName: file.originalname,
    filePath: file.path.replace('\\', '/'),
    fileType: file.mimetype,
    fileSize: fileSizeFormatter(file.size, 2) // 0.00
  });
  await newImage.save();

  return file.path.replace('\\', '/');
};
