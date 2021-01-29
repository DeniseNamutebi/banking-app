const express = require("express")
const app = express()
const { Account, Friend, sequelize } = require("./model")
const Handlebars = require('handlebars')
const expressHandlebars = require("express-handlebars")
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { auth, requiresAuth } = require('express-openid-connect')
const Mailer = require('./mailer')

if (process.env.NODE_ENV !== "production") {
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
app.use(express.urlencoded())
app.use(auth(openIDconfig))
app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded())


app.get('/', (req, res) => {
  req.oidc.isAuthenticated() ? res.redirect("/profile") : res.redirect("/login")
});

app.get("/profile", requiresAuth(), (req, res) => {
  const person = req.oidc.user
  res.render("profile", { person });
});

app.get("/friends/request", (req, res) => {
  const {invited, invitee} = req.query
  res.render('invite-friend', {invited, invitee})
})

app.post('/friends/request/accepted', (req, res) => {
  const {invited, invitee, url} = req.body
  // Ready to create a friend with the following data:
  console.log({invited, invitee, url})
  res.redirect('/')
})

app.post('/friends/invite', requiresAuth(), (req, res) => {
  const email = req.body.email
  const mailer = new Mailer(req.oidc.user.email, req.oidc.user.sub)
  mailer.sendEmailInvite(email)
  res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => {
  sequelize.sync()
    .then(console.log("Server running on PORT", process.env.PORT))
})
