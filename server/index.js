//  OpenShift sample Node application
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./domain");
const rest = require("./rest");

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', rest);
app.use(express.static(path.join(__dirname, '../dist/mlnr-openshift/')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/mlnr-openshift/index.html'));
});
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
let mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

if (!mongoURL) {
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    var mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    var mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    var mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    var mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    var mongoUser = process.env[mongoServiceName + '_USER'];
  } else {
    var mongoHost = "localhost";
    var mongoPort = 27017;
    var mongoDatabase = "admin";
    var mongoPassword = "darius1601";
    var mongoUser = "rltf";
  }
  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  }
}

console.log("Connecting to Mongo | " + mongoURL);
mongoose.connect(mongoURL, { useNewUrlParser: true }, err => {
  if (err) throw err;
  console.log(`Successfully connected to database.`);
});

console.log("Connecting on " + ip + ":" + port);
app.listen(port, ip, (err) => {
  if (err) throw err;
  console.log(`Successfully started server`);
});

module.exports = app;