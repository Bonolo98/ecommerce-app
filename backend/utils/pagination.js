const paginate = (query, { limit = 10, page = 1 }) => {
    const offset = (page - 1) * limit;
    return `${query} LIMIT ${limit} OFFSET ${offset}`;
  };
  
  module.exports = { paginate };
  