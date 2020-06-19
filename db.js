
const {Sequelize} = require('sequelize');

module.exports = new Sequelize('heroku_52ddba0528fe872', 'bcf8385c77447b', 'fde342c3', {
    host: 'eu-cdbr-west-03.cleardb.net',
    dialect:  'mysql'
   });
  


