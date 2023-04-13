const db = require("../models");
const Tutorial = db.tutorials;
const Sequelize = db.Sequelize;
const Op = db.Sequelize.Op;
const _ = require("lodash");
const utmObj = require("utm-latlng");

///import utm-latlng
const geojsonobj = require("geojson");
const fs = require("fs");

//read tr-cities-utf8.geojson geojson file
const geojson = JSON.parse(fs.readFileSync("tr-cities-utf8.geojson"));
const ilceler = JSON.parse(fs.readFileSync("tr_ilce.geojson"));

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, tutorials, totalPages, currentPage };
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  let { page, size, il, ilce, yontem, userStatus, requestFlag, areaJson } =
    req.query;
  const { limit, offset } = getPagination(page, size);
  var filters = {};
  console.log(ilArray);
  if (il !== null && il !== undefined) {
    var ilArray = geojson.features.filter(
      (item) => item.properties.name.toLowerCase() == il.toLowerCase()
    );
  }
  var condition = null;

  if (
    ilArray !== null &&
    ilArray !== undefined &&
    ilArray.length !== 0 &&
    (areaJson === null || areaJson === undefined)
  ) {
    //create a new array with the arrays in il array
    areaJson = ilArray;
  } else if (areaJson != null) {
    var reg = /^\d+$/;

    if (reg.test(areaJson)) {
      ilArray = ilceler.features.filter(
        (item) => item.properties.Id == areaJson
      );
      areaJson = ilArray;
    } else {
      areaJson = [JSON.parse(areaJson)];
    }
  } else {
    condition = il ? { il: { [Op.iLike]: `%${il}%` } } : null;
  }

  if (requestFlag == "userSearch") {
    var fields = Object.keys(
      _.pick(Tutorial.rawAttributes, [
        "nokta_adi",
        "calisma_amaci",
        "il",
        "ilce",
        "yontem",
        "alt_yontem",
        "yuzbin",
        "yirmibesbin",
        "besyuzbin",
      ])
    );

    fields.forEach((item) => (filters[item] = { [Op.iLike]: `%${il}%` }));
    condition = il ? { [Op.or]: filters } : null;
  }
  var locationCondition = null;

  if (areaJson != null) {
    locationCondition = Tutorial.sequelize.where(
      Tutorial.sequelize.fn(
        "ST_Within",
        Tutorial.sequelize.col("location"),
        Tutorial.sequelize.fn(
          "ST_GeomFromGeoJSON",
          JSON.stringify(areaJson[0].geometry)
        )
      ),
      true
    );
  }

  Tutorial.findAndCountAll({
    //when userStatus is user, where contains locationcondition, yontem, limit and offset
    //use only locationcondition, yontem, limit and offset

    where:
      locationCondition != null
        ? [
            locationCondition,
            ilce ? { ilce: { [Op.iLike]: `%${ilce}%` } } : null,

            yontem
              ? {
                  [Op.or]: [
                    { yontem: { [Op.or]: yontem } },
                    { alt_yontem: { [Op.or]: yontem } },
                  ],
                }
              : null,
            limit,
            offset,
          ]
        : Object.assign(
            {},
            condition,
            ilce ? { ilce: { [Op.iLike]: `%${ilce}%` } } : null,
            yontem
              ? {
                  [Op.or]: [
                    { yontem: { [Op.or]: yontem } },
                    { alt_yontem: { [Op.or]: yontem } },
                  ],
                }
              : null,
            //published will be true if the userStatus is 'user'. if not, it can be false or true.
            userStatus == "user"
              ? { published: true }
              : { published: { [Op.or]: [true, false] } }
          ),

    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findAllgetAll = (req, res) => {
  const { il, ilce, yontem, userStatus, requestFlag } = req.query;
  //find il in geojson
  if (il !== null && il !== undefined) {
    var ilArray = geojson.features.filter(
      (item) => item.properties.name.toLowerCase() == il.toLowerCase()
    );
  }
  var condition = null;
  var locationCondition = null;
  if (ilArray !== null && ilArray !== undefined && ilArray.length !== 0) {
    locationCondition = Tutorial.sequelize.where(
      Tutorial.sequelize.fn(
        "ST_Within",
        Tutorial.sequelize.col("location"),
        Tutorial.sequelize.fn(
          "ST_GeomFromGeoJSON",
          JSON.stringify(ilArray[0].geometry)
        )
      ),
      true
    );
  } else {
    condition = il ? { il: { [Op.iLike]: `%${il}%` } } : null;
  }

  var filters = {};
  if (requestFlag === "userSearch" || requestFlag === "excel") {
    var fields = Object.keys(
      _.pick(Tutorial.rawAttributes, [
        "nokta_adi",
        "calisma_amaci",
        "il",
        "ilce",
        "yontem",
        "alt_yontem",
        "yuzbin",
        "yirmibesbin",
        "besyuzbin",
      ])
    );

    fields.forEach((item) => (filters[item] = { [Op.iLike]: `%${il}%` }));
    condition = il ? { [Op.or]: filters } : null;
  }

  Tutorial.findAll({
    where:
      locationCondition != null
        ? [
            locationCondition,
            ilce ? { ilce: { [Op.iLike]: `%${ilce}%` } } : null,
            yontem
              ? {
                  [Op.or]: [
                    { yontem: { [Op.or]: yontem } },
                    { alt_yontem: { [Op.or]: yontem } },
                  ],
                }
              : null,
            //published will be true if the userStatus is 'user'. if not, it can be false or true.
            userStatus == "user"
              ? { published: true }
              : { published: { [Op.or]: [true, false] } },
          ]
        : Object.assign(
            {},
            condition,
            ilce ? { ilce: { [Op.iLike]: `%${ilce}%` } } : null,
            yontem
              ? {
                  [Op.or]: [
                    { yontem: { [Op.or]: yontem } },
                    { alt_yontem: { [Op.or]: yontem } },
                  ],
                }
              : null,
            //published will be true if the userStatus is 'user'. if not, it can be false or true.
            userStatus == "user"
              ? { published: true }
              : { published: { [Op.or]: [true, false] } }
          ),
  })
    .then((data) => {
      var resdata = null;
      if (requestFlag !== "excel") {
        //need to create line for geojson if profil_baslangic_x and profil_baslangic_y is not null
        data.forEach((item) => {
          if (
            item.profil_baslangic_x !== null &&
            item.profil_baslangic_y !== null &&
            item.profil_bitis_x !== null &&
            item.profil_bitis_y !== null
          ) {
            var utm = null;
            if (item.datum === "WGS_84") {
              utm = new utmObj("WGS 84");
            } else if (item.datum === "ED_50") {
              utm = new utmObj("ED50");
            }

            var lineStart = utm.convertUtmToLatLng(
              item.profil_baslangic_x,
              item.profil_baslangic_y,
              item.zone,
              "N"
            );
            var lineEnd = utm.convertUtmToLatLng(
              item.profil_bitis_x,
              item.profil_bitis_y,
              item.zone,
              "N"
            );
            item.line = [
              [lineStart.lat, lineStart.lng],
              [lineEnd.lat, lineEnd.lng],
            ];
          } else {
            item.line = null;
          }
        });
        var forPlot = [];
        const pick = (obj, arr) =>
          arr.reduce(
            (acc, record) => (
              record in obj && (acc[record] = obj[record]), acc
            ),
            {}
          );
        data.forEach((item) =>
          forPlot.push(
            pick(item, [
              "id",
              "yontem",
              "alt_yontem",
              "nokta_adi",
              "x",
              "y",
              "profil_baslangic_x",
              "profil_baslangic_y",
              "profil_bitis_x",
              "profil_bitis_y",
              "zone",
              "line",
              "datum",
              "a_1",
              "a_2",
              "a_3",
              "a_4",
              "lat",
              "lon",
            ])
          )
        );
        const lines = [];
        forPlot.forEach((item) => {
          if (item.line !== null) {
            lines.push(item);
          }
        });
        var resPoints = geojsonobj.parse(forPlot, { Point: ["lon", "lat"] });
        var resLines = lines;

        resdata = { resPoints: resPoints, resLines: resLines };
      } else {
        var arr = [];
        data.forEach((item) => {
          delete item.dataValues.id;
          delete item.dataValues.createdAt;
          delete item.dataValues.updatedAt;
          delete item.dataValues.editorname;
          delete item.dataValues.published;
          delete item.dataValues.lat;
          delete item.dataValues.lon;
          arr.push(item.dataValues);
        });
        resdata = arr;
      }

      res.send(resdata);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//Find all tutorials inside the geojson polygon
exports.findAllGeo = (req, res) => {
  const { geojson, yontem, userStatus, requestFlag } = req.query;
  var ilceArray = ilceler.features.filter(
    (item) => item.properties.Id == geojson
  );
  var locationCondition = null;

  if (ilceArray.length > 0) {
    locationCondition = Tutorial.sequelize.where(
      Tutorial.sequelize.fn(
        "ST_Within",
        Tutorial.sequelize.col("location"),
        Tutorial.sequelize.fn(
          "ST_GeomFromGeoJSON",
          JSON.stringify(ilceArray[0].geometry)
        )
      ),
      true
    );
  } else {
    locationCondition = Tutorial.sequelize.where(
      Tutorial.sequelize.fn(
        "ST_Within",
        Tutorial.sequelize.col("location"),
        Tutorial.sequelize.fn(
          "ST_GeomFromGeoJSON",
          '{"type":"Polygon","coordinates":[[' + geojson + "]]}"
        )
      ),
      true
    );
  }

  Tutorial.findAll({
    where: [
      locationCondition,
      yontem
        ? {
            [Op.or]: [
              { yontem: { [Op.or]: yontem } },
              { alt_yontem: { [Op.or]: yontem } },
            ],
          }
        : null,
      userStatus === "user"
        ? { published: true }
        : { published: { [Op.or]: [true, false] } },
    ],
  })
    .then((data) => {
      var resdata = null;
      if (requestFlag !== "excel") {
        data.forEach((item) => {
          if (
            item.profil_baslangic_x !== null &&
            item.profil_baslangic_y !== null &&
            item.profil_bitis_x !== null &&
            item.profil_bitis_y !== null
          ) {
            var utm = null;
            if (item.datum === "WGS_84") {
              utm = new utmObj("WGS 84");
            } else if (item.datum === "ED_50") {
              utm = new utmObj("ED50");
            }

            var lineStart = utm.convertUtmToLatLng(
              item.profil_baslangic_x,
              item.profil_baslangic_y,
              item.zone,
              "N"
            );
            var lineEnd = utm.convertUtmToLatLng(
              item.profil_bitis_x,
              item.profil_bitis_y,
              item.zone,
              "N"
            );
            item.line = [
              [lineStart.lat, lineStart.lng],
              [lineEnd.lat, lineEnd.lng],
            ];
          } else {
            item.line = null;
          }
        });
        var forPlot = [];
        const pick = (obj, arr) =>
          arr.reduce(
            (acc, record) => (
              record in obj && (acc[record] = obj[record]), acc
            ),
            {}
          );
        data.forEach((item) =>
          forPlot.push(
            pick(item, [
              "id",
              "yontem",
              "alt_yontem",
              "nokta_adi",
              "x",
              "y",
              "profil_baslangic_x",
              "profil_baslangic_y",
              "profil_bitis_x",
              "profil_bitis_y",
              "zone",
              "datum",
              "a_1",
              "a_2",
              "a_3",
              "a_4",
              "lat",
              "lon",
            ])
          )
        );
        const lines = [];
        forPlot.forEach((item) => {
          if (item.line !== null) {
            lines.push(item);
          }
        });
        var resPoints = geojsonobj.parse(forPlot, { Point: ["lon", "lat"] });
        var resLines = lines;

        resdata = { resPoints: resPoints, resLines: resLines };
      } else {
        var arr = [];
        data.forEach((item) => {
          delete item.dataValues.id;
          delete item.dataValues.createdAt;
          delete item.dataValues.updatedAt;
          delete item.dataValues.editorname;
          delete item.dataValues.published;
          delete item.dataValues.lat;
          delete item.dataValues.lon;
          arr.push(item.dataValues);
        });
        resdata = arr;
      }

      res.send(resdata);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.autosan.params.id;

  Tutorial.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.autosan.params.id;
  var fields = Object.keys(req.body);
  let forDeletion = ["id"];
  fields = fields.filter((item) => !forDeletion.includes(item));

  Tutorial.update(req.autosan.body, {
    //exclude id when updating
    where: { id: id },

    //exclude id when updating
    fields: fields,
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({ where: { published: true }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
//find all unpublished tutorial
exports.findAllUnpublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({ where: { published: false }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//get number of tutorials for each alt_yontem sequelize query raw query SELECT
//    alt_yontem,
//    COUNT (*) AS "numberof"
//  FROM
//     tutorials

//  GROUP BY
//    alt_yontem;
exports.AltYontemCount = (req, res) => {
  Tutorial.count({
    group: "alt_yontem",
    attributes: [
      "alt_yontem",
      [Sequelize.fn("COUNT", Sequelize.col("alt_yontem")), "numberof"],
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
