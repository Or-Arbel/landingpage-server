const fs = require('fs');

module.exports = removeImage = async (model, id) => {
  console.log('hello from remove image');
  const imageToDelete = await model
    .findByPk(id)
    .then(res => res.toJSON())
    .then(row => row.image);

  console.log('image to delete : ');
  console.log(imageToDelete);

  if (imageToDelete) {
    fs.unlink('./' + imageToDelete, err => {
      if (err) {
        console.log('Delete action failed with error: ' + err);
      }
      console.log('\nDeleted file: ./' + imageToDelete);
    });
  }
};
