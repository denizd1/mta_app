module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const expAutoSan = require("express-autosanitizer");
  const { verifyTutorial } = require("../middleware");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post(
    "/",
    verifyTutorial.checkDuplicatenoktaAdi,
    expAutoSan.route,
    tutorials.create
  );

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);
  router.get("/getall", tutorials.findAllgetAll);

  // Retrieve all Tutorials in geojson
  router.get("/findAllGeo", tutorials.findAllGeo);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", expAutoSan.route, tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", expAutoSan.route, tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  // router.delete("/", tutorials.deleteAll);

  app.use("/api/tutorials", router);
};
