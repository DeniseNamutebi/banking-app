const {Model, DataTypes, Sequelize} = require('sequelize')
const connectionSettings = {
    test: {dialect: 'sqlite', storage: 'sqlite::memory:'},
    dev: {dialect: 'sqlite', storage: path.join(__dirname, 'banking.db')},
    production: {dialect: 'postgres', protocal: 'postgres'}
}
const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, connectionSettings[process.env.NODE_ENV])
    : new Sequelize(connectionSettings[process.env.NODE_ENV])

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