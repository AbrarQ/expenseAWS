

const Sequelize = require ('sequelize');


const sequelizedb  = require('../util/dbConnection');
const orderModel =  sequelizedb.define('orders',{
  id : { 
    type : Sequelize.INTEGER, 
    autoIncrement : true,
    allowNull : false,
    primaryKey : true,
  },

  paymentid : Sequelize.STRING,
  orderid : Sequelize.STRING,
  status : Sequelize.STRING
})

module.exports = orderModel;
