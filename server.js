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
  const friends = Friend.findAll({where:{sub:req.oidc.user.sub}})
  res.render("profile", { person, friends });
});

app.get("/friends/request", (req, res) => {
  console.log(req.query)
  const {sub, to} = req.query
  res.render('invite-friend', {sub, to})
})

app.post('/friends/request/accepted', async (req, res) => {
  const friend = await Friend.create(req.body)
  res.redirect('/')
})

app.post('/friends/invite', requiresAuth(), (req, res) => {
  const email = req.body.email
  const mailer = new Mailer(req.oidc.user)
  mailer.sendEmailInvite(email)
  res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => {
  sequelize.sync()
    .then(console.log("Server running on PORT", process.env.PORT))
})
