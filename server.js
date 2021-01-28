const express = require("express")
const app = express()
const {Account, Friend, sequelize} = require("./model")
const Handlebars = require('handlebars')
const expressHandlebars = require("express-handlebars")
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const { auth } = require('express-openid-connect')
const { requiresAuth } = require('express-openid-connect')

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN
};

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.json())
app.use(auth(config))
app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get("/profile", requiresAuth(), (req, res) => {
   const person = req.oidc.user
    res.render("profile", { person });
  });



app.listen(process.env.PORT, () => {
    sequelize.sync()
    .then(console.log("Server running on PORT", process.env.PORT))
})