const { Router } = require("express");
const { upload } = require("./configs/multer");

const FileController = require("./apps/controllers/FileController");

const schemaValidator = require("./apps/middlewares/schemaValidator");

const AuthenticateMiddleware = require("./apps/middlewares/authentications");

const AuthenticationController = require("./apps/controllers/AuthenticatonController");
const authSchema = require("./schemas/auth.schema.json");

const UserController = require("./apps/controllers/UserController");
const userSchema = require("./schemas/create.user.schema.json");

const postController = require("./apps/controllers/PostController");
const postSchema = require("./schemas/create.post.schema.json");

const routes = new Router();

routes.get("/getAllUsers", UserController.getAllUsers);

routes.post("/createUser", schemaValidator(userSchema), UserController.create);

routes.post("/login", schemaValidator(authSchema), AuthenticationController.authenticate);

routes.use(AuthenticateMiddleware);

routes.get("/", (req, res) => {
  res.send({ message: "Pega o pai" });
});

routes.post("/updateUser", UserController.update);
routes.delete("/deleteUser/:id", UserController.delete);
routes.get("/profileUser", UserController.profileUser);

routes.post("/upload", upload.single("image"), FileController.upload);

routes.post("/createPost", schemaValidator(postSchema), postController.create);
routes.delete("/deletePost/:id", postController.delete);

module.exports = routes;
