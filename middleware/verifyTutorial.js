const db = require("../models");
const Tutorial = db.tutorials;

checkDuplicatenoktaAdi = (req, res, next) => {
  Tutorial.findOne({
    where: {
      nokta_adi: req.body.nokta_adi,
      alt_yontem: req.body.alt_yontem,
      proje_kodu: req.body.proje_kodu,
    },
  }).then((tutorial) => {
    if (tutorial) {
      res.status(400).send({
        message: `Nokta Adı : ${req.body.nokta_adi}, Proje Kodu : ${req.body.proje_kodu}, Alt Yöntem : ${req.body.alt_yontem}`,
      });
      return;
    }

    next();
  });
};

const verifyTutorial = {
  checkDuplicatenoktaAdi: checkDuplicatenoktaAdi,
};

module.exports = verifyTutorial;
