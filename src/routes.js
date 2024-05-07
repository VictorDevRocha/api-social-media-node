const { Router } = require("express");

const routes = new Router();

routes.get("/", (req, res) => {
  res.send({ message: "Pega o pai" });
});

module.exports = routes;
