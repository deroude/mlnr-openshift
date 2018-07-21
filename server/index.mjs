//  OpenShift sample Node application
import express from "express";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import passportLocal from "passport-local";
import session from "express-session";
import bodyParser from "body-parser";
import { User } from "./domain";
import rest from "./rest";
import expose from './expose.js';
const { __dirname } = expose;

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

app.use(express.static(path.join(__dirname, 'dist/mlnr-openshift')));
app.use('/api', rest);

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP ;
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
mongoose.connect(mongoURL);

app.listen(port, ip);