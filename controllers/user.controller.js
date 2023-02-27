//need db, user model and sequelize to get all users from db
const db = require("../models");
const { user: User, role: Role } = db;

exports.getAllUsers = (req, res) => {
  User.findAll({
    include: [
      {
        model: Role,
        //where roles are not defined for user
        where: { id: 4 },
      },
    ],
  })
    .then((data) => {
      var userlist = [];
      const pick = (obj, arr) =>
        arr.reduce(
          (acc, record) => (record in obj && (acc[record] = obj[record]), acc),
          {}
        );
      data.forEach((item) => userlist.push(pick(item, ["id", "username"])));
      res.send(userlist);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

//user roles are defined in role table. find the user with user id in req.body then update join table with role id
exports.updateUser = (req, res) => {
  const id = req.body.id;
  User.findByPk(id, {
    include: [
      {
        model: Role,
        //where roles are not defined for user
      },
    ],
  })
    .then((data) => {
      return Promise.all([data.setRoles(req.body.role)]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};
