module.exports = (app) => {
  const { authJwt } = require("../middleware");
  const raporController = require("../controllers/rapor.controller.js");

  var router = require("express").Router();

  // get all rapor
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    raporController.getAll
  );

  app.use("/api/rapor", router);
};
