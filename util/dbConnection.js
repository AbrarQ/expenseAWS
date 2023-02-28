// const Sequelize = require ('sequelize');

// const sequelize = new Sequelize( process.env.DB_NAME, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
//     dialect : 'mysql',
//     host : process.env.DB_HOST
// });

const Sequelize = require ('sequelize');
const sequelize = new Sequelize('nodejs','root', 'H3lloworld!', {
    dialect : 'mysql',
    host : 'localhost'
});


module.exports =   sequelize;

