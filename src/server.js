require("dotenv").config();
require("./database/index");
const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is on in port ${PORT}`);
});
