const processMessage = require('../../hooks/process-message');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [processMessage()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
