Carousels.sync({ alter: true }).then(() => {
  return Carousels.findAll({
    // get columns : =========================================================================

    // get x as 'aliasX' from table_name
    // get specific columns from Carousels table and give them alias
    attributes: [
      ['id', 'some alias to id'],
      ['orderNumber', 'some alias to order number'],
    ],
    attributes: [
      // get column that sums ALL id's from the Carousels table and give them alias
      [sequalize.fn('SUM', sequalize.col('id')), 'alias to the SUM column'],
      // get column that calculates the avarege id from the Carousels table and give them alias
      [sequalize.fn('AVG', sequalize.col('id')), 'alias to the SUM column'],
    ],
    // get All columns from Carousels table except from createAt
    attributes: {
      exclude: ['createAt'],
    },

    // where: =========================================================================

    // where corousel name = 'מבצעית' and orderNumber = 2
    where: { name: 'מבצעית', orderNumber: 2 }, // where name = "מבצעית" AND orderNumber = 2
    //limit number of rows returned:
    limit: 2,
    // order by: =========================================================================

    // order by id in ascending order
    order: [['id'], ['ASC']],

    // group by: =========================================================================

    // get a list. each row has isername column and the sum of the age for the users with this name
    // for example if there are two 'avichai' useres and their age is 24 and 25 we will get:
    //{username: 'avichai}, age_sum: '49'}
    attributes: [
      'username',
      [sequalize.fn('SUM', sequalize.col('age')), 'age_sum'],
    ],
    group: username,

    // operators: =========================================================================
    where: {
      [Op.or]: { username: 'avichai', age: 24 }, // where username = 'avichai' || age = 24
    },
    where: {
      [Op.and]: { username: 'avichai', age: 24 }, // where username = 'avichai' &&  age = 24
    },
    where: {
      age: {
        [Op.gte]: 24, // where age >= 25
        [Op.gt]: 24, // where age > 25
        [Op.lt]: 24, // where age < 25
        [Op.eq]: 24, // where age == 25
      },
    },
  });
});
