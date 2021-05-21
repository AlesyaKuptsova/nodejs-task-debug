const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ValidationError } = require("sequelize");

const authKey = process.env.AUTH_KEY;

const User = require("../db").import("../models/user");

function setError(res, err) {
  res.status(500).json({
    error: err.message,
  });
}

router.post("/signup", (req, res) => {
  User.create({
    full_name: req.body.user.full_name,
    username: req.body.user.username,
    passwordHash: bcrypt.hashSync(req.body.user.password, 10),
    email: req.body.user.email,
  }).then(
    function signupSuccess(user) {
      let token = jwt.sign({ id: user.id }, authKey, {
        expiresIn: 60 * 60 * 24,
      });
      res.status(200).json({
        user: user,
        token: token,
      });
    },
    function signupFail(err) {
      if (err instanceof ValidationError) {
        res.status(400).send(err.message);
      } else {
        setError(res, err);
      }
    }
  );
});

router.post("/signin", (req, res) => {
  function authFailed() {
    res.status(401).send({ error: "Signin failed." });
  }
  User.findOne({ where: { username: req.body.user.username } }).then(
    (user) => {
      if (user) {
        bcrypt.compare(
          req.body.user.password,
          user.passwordHash,
          function (err, matches) {
            if (matches) {
              let token = jwt.sign({ id: user.id }, authKey, {
                expiresIn: 60 * 60 * 24,
              });
              res.status(200).json({
                user: user,
                message: "Successfully authenticated.",
                sessionToken: token,
              });
            } else {
              authFailed();
            }
          }
        );
      } else {
        authFailed();
      }
    },
    (err) => {
      setError(res, err);
    }
  );
});

module.exports = router;
