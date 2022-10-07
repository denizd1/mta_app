const db = require("../models");
const Tutorial = db.tutorials;

checkDuplicatenoktaAdi = (req, res, next) => {
  Tutorial.findOne({
    where: {
      nokta_adi: req.body.nokta_adi,
      alt_yontem: req.body.alt_yontem,
      proje_kodu: req.body.proje_kodu,
      il: req.body.il,
      ilce: req.body.ilce,
      calisma_tarihi: req.body.calisma_tarihi,
    },
  }).then((tutorial) => {
    if (tutorial) {
      res.status(400).send({
        message: `Nokta Adı : ${req.body.nokta_adi}, Jeofizik Arşiv No : ${req.body.jeofizik_arsiv_no}, Derleme No : ${req.body.derleme_no}`,
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
