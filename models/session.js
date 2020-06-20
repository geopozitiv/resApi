const { DataTypes, Model } = require('sequelize');
const db = require('../db')

class Session extends Model {}

Session.init({
  // Model attributes are defined here
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fingerPrint: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Session' // We need to choose the model name
});

// User.beforeCreate(async (user, options, cb) => {
//     return await bcrypt.hash(user.dataValues.password, 8)
//     .then(hashd => {
//       return user.dataValues.password = hashd
//     })
// });

module.exports = Session