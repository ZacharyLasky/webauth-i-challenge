const express = require("express");
const router = require("./router");
const server = express();

const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const dbConnection = require("./database/dbConfig.js");

const sessionConfig = {
  name: "chocochip", // would name the cookie sid by default
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
  cookie: {
    maxAge: 60000, // in milliseconds
    secure: false, // true means only send cookie over https
    httpOnly: true // true means JS has no access to the cookie
  },
  resave: false,
  saveUninitialized: true, // GDPR compliance
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "knexsessions",
    sidfieldname: "sessionid",
    createtable: true,
    clearInterval: 30000 // clean out expired session data
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use("/", router);

server.get("/", (req, res) => {
  res.send("Testing123!");
});

module.exports = server;
