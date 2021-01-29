const {Model, DataTypes, Sequelize} = require('sequelize')
const path = require("path")

const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, {dialect: 'postgres', protocal: 'postgres'})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'banking.db')})

class Account extends Model {}
Account.init({
    current_balance: DataTypes.FLOAT,
    sub: DataTypes.STRING
    
}, {sequelize})

class Friend extends Model {}
Friend.init({
    email: DataTypes.STRING,
    site_address: DataTypes.STRING,
    sub: DataTypes.STRING
}, {sequelize})

module.exports = {
    Account,
    Friend,
    sequelize
}