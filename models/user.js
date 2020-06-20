const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs')
const db = require('../db')

class User extends Model {}

User.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      isEmail: true
    }  
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

User.beforeCreate(async (user, options, cb) => {
    return await bcrypt.hash(user.dataValues.password, 8)
    .then(hashd => {
      return user.dataValues.password = hashd
    })
});

module.exports = User