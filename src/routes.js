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

routes.get("/users/allUsers", UserController.getAllUsers);

routes.post("/user", schemaValidator(userSchema), UserController.create);

routes.post("/login", schemaValidator(authSchema), AuthenticationController.authenticate);

routes.use(AuthenticateMiddleware);

routes.get("/", (req, res) => {
  res.send({ message: "Pega o pai" });
});

routes.put("/user", UserController.update);
routes.delete("/user/:id", UserController.delete);
routes.get("/user", UserController.profileUser);

routes.post("/upload", upload.single("image"), FileController.upload);

routes.post("/posts", schemaValidator(postSchema), postController.create);
routes.put("/posts/:id", postController.update);
routes.delete("/posts/:id", postController.delete);
routes.get("/posts/MyPosts", postController.listMyPost);

routes.put("/posts/addLike/:id", postController.addLike);
routes.get("/posts/allPosts", postController.listAllPost);

module.exports = routes;
