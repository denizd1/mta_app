module.exports = (app) => {
  const { authJwt } = require("../middleware");

  const tutorials = require("../controllers/tutorial.controller.js");
  const expAutoSan = require("express-autosanitizer");
  const { verifyTutorial } = require("../middleware");

  var router = require("express").Router();
  // app.use(function (req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  // Create a new Tutorial
  router.post(
    "/",
    // verifyTutorial.checkDuplicatenoktaAdi,
    expAutoSan.route,
    tutorials.create
  );

  // Retrieve all Tutorials
  router.get("/", [authJwt.verifyToken], tutorials.findAll);
  router.get("/getall", [authJwt.verifyToken], tutorials.findAllgetAll);

  // Retrieve all Tutorials in geojson
  router.get("/findAllGeo", [authJwt.verifyToken], tutorials.findAllGeo);

  // Retrieve all published Tutorials
  router.get("/published", [authJwt.verifyToken], tutorials.findAllPublished);

  //Retrieve all unpublished Tutorials
  router.get(
    "/unpublished",
    [authJwt.verifyToken, authJwt.isAdmin],
    tutorials.findAllUnpublished
  );

  // Retrieve a single Tutorial with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    expAutoSan.route,
    tutorials.findOne
  );
  // Update a Tutorial with id
  router.put(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin || authJwt.isModerator],
    expAutoSan.route,
    tutorials.update
  );

  // Delete a Tutorial with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    tutorials.delete
  );

  // Delete all Tutorials
  // router.delete("/", tutorials.deleteAll);

  app.use("/api/tutorials", router);
};
