class APIFeatures {
  constructor(queryString) {
    this.query = {};
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['order', 'fields', 'page', 'limit' ];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query.where = JSON.parse(queryStr);

    return this;
  }

  order() {
    if (this.queryString.order) {
      const orderBy = this.queryString.order.split(',').map( value => 
        value.startsWith('-') ? [value.replace('-', ''), 'DESC'] : [value]
       );
      this.query.order = orderBy;
    } else {
      this.query.order = [['createdAt', 'ASC']];
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',');
      this.query.attributes = fields;
    }
    
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.limit = limit;
    this.query.offset = skip;
    return this;
  }
}


module.exports = APIFeatures;
