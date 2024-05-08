const { Router } = require("express");
const usersModel = require("./apps/models/Users");
const routes = new Router();

routes.get("/", (req, res) => {
  res.send({ message: "Pega o pai" });
});

routes.get("/users", async (req, res) => {
  const allUsers = await usersModel.findAll();

  res.send({ users: allUsers });
});

module.exports = routes;
