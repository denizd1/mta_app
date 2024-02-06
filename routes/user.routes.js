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
  router.put("/forgotPassword", controller.forgotPassword);
  router.put("/resetPassword", controller.resetPassword);

  app.use("/api/users", router);
};
