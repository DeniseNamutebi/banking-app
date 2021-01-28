const {Model, DataTypes, Sequelize} = require('sequelize')
const sequelize = new Sequelize('sqlite:./banking.db')

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