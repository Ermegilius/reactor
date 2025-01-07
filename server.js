import { backEndUrl } from "./src/data/globalVariables.js";

const cors = require("cors");
const path = require("path");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(
  path.join(__dirname, "src", "data", "db.json")
);
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`JSON Server is running on ${backEndUrl}:${PORT}`);
  //console.log(`JSON Server is running on http://localhost:${PORT}`);
});
