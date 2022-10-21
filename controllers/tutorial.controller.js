const db = require("../models");
const Tutorial = db.tutorials;
const Sequelize = db.Sequelize;
const Op = db.Sequelize.Op;
const _ = require("lodash");

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
  const { page, size, il, ilce, yontem, userStatus, requestFlag, areaJson } =
    req.query;
  const { limit, offset } = getPagination(page, size);
  var filters = {};
  var condition = null;
  condition = il ? { il: { [Op.iLike]: `%${il}%` } } : null;

  if (requestFlag == "userSearch") {
    var fields = Object.keys(
      _.pick(Tutorial.rawAttributes, [
        "nokta_adi",
        "calisma_amaci",
        "il",
        "ilce",
        "yontem",
        "alt_yontem",
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
          '{"type":"Polygon","coordinates":[[' + areaJson + "]]}"
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
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findAllgetAll = (req, res) => {
  const { il, ilce, yontem, userStatus, requestFlag } = req.query;
  var condition = null;
  condition = il ? { il: { [Op.iLike]: `%${il}%` } } : null;
  var filters = {};
  if (requestFlag == "userSearch") {
    var fields = Object.keys(
      _.pick(Tutorial.rawAttributes, [
        "nokta_adi",
        "calisma_amaci",
        "il",
        "ilce",
        "yontem",
        "alt_yontem",
      ])
    );

    fields.forEach((item) => (filters[item] = { [Op.iLike]: `%${il}%` }));
    condition = il ? { [Op.or]: filters } : null;
  }

  Tutorial.findAll({
    where: Object.assign(
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
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//Find all tutorials inside the geojson polygon
exports.findAllGeo = (req, res) => {
  const { geojson, yontem, userStatus } = req.query;

  var locationCondition = Tutorial.sequelize.where(
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
      res.send(data);
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
  console.log(req);
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
