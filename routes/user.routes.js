const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  var router = require("express").Router();

  router.get(
    "/userlist",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );
  router.put(
    "/updateUser",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUser
  );

  app.use("/api/users", router);
};
