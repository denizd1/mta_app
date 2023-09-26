const db = require("../models");
exports.getAll = (req, res) => {
  Rapor.findAll({
    include: [
      {
        model: User,
        //where roles are not defined for user
        where: { id: 4 },
      },
    ],
  })
    .then((data) => {
      var raporlist = [];
      const pick = (obj, arr) =>
        arr.reduce(
          (acc, record) => (record in obj && (acc[record] = obj[record]), acc),
          {}
        );
      data.forEach((item) => raporlist.push(pick(item, ["id", "username"])));
      res.send(raporlist);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rapors.",
      });
    });
};
