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

const openIDconfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN
};

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.json())
app.use(auth(openIDconfig))
app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
   // req.oidc.isAuthenticated() ? res.redirect("/profile") : res.redirect("/login")
   res.send("request is authenticated")
});

app.get("/profile", requiresAuth(), (req, res) => {
   const person = req.oidc.user
    res.render("profile", { person });
  });


app.listen(process.env.PORT || 3000, () => {
    sequelize.sync()
    .then(console.log("Server running on PORT", process.env.PORT))
})
