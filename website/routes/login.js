const express = require("express");
const app = express.Router();
const passport = require("passport");

app.get("/", (req, res, next) => {
  req.session.redirect = req.query.redirect;
  req.session.save();

  passport.authenticate("discord", { failureRedirect: "/" })(req, res, next);
});

app.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(req.session.redirect || "/");
  }
);

module.exports = app;
