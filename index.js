const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://bcf8385c77447b:fde342c3@eu-cdbr-west-03.cleardb.net/heroku_52ddba0528fe872?reconnect=true');

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }