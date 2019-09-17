const express = require("express");
const Users = require("./db-helpers");
const restricted = require("./auth/restricted-middleware");
const router = express.Router();
const cors = require("cors");

const corsConfig = {
  origin: "http://localhost:5325",
  credentials: true
};
router.use(cors(corsConfig));

const bcrypt = require("bcryptjs");

router.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You cannot pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/api/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
});

module.exports = router;
