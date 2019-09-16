const express = require("express");
const router = require("./router");
const server = express();

const helmet = require("helmet");
const cors = require("cors");

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use("/", router);

server.get("/", (req, res) => {
  res.send("Testing123!");
});

module.exports = server;
