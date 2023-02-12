const path = require('path');

module.exports = {
  webpack: {
    alias: {
      contexts: path.resolve(__dirname, 'src/contexts/'),
      components: path.resolve(__dirname, 'src/components/'),
      api: path.resolve(__dirname, 'src/api/')
    }
  }
};
