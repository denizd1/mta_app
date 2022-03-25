const db = require("../models");
const Tutorial = db.tutorials;
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

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.autosan.body.nokta_adi) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    nokta_adi: req.autosan.body.nokta_adi,
    yontem: req.autosan.body.yontem,
    alt_yontem: req.autosan.body.alt_yontem,
    calisma_amaci: req.autosan.body.calisma_amaci,
    satilabilirlik: req.autosan.body.satilabilirlik,
    ham_veri: req.autosan.body.ham_veri,
    calisma_tarihi: req.autosan.body.calisma_tarihi,
    proje_kodu: req.autosan.body.proje_kodu,
    kuyu_arsiv_no: req.autosan.body.kuyu_arsiv_no,
    jeofizik_arsiv_no: req.autosan.body.jeofizik_arsiv_no,
    derleme_no: req.autosan.body.derleme_no,
    cd_no: req.autosan.body.cd_no,
    il: req.autosan.body.il,
    ilce: req.autosan.body.ilce,
    x: req.autosan.body.x,
    y: req.autosan.body.y,
    z: req.autosan.body.z,
    profil_baslangic_x: req.autosan.body.profil_baslangic_x,
    profil_baslangic_y: req.autosan.body.profil_baslangic_y,
    profil_bitis_x: req.autosan.body.profil_bitis_x,
    profil_bitis_y: req.autosan.body.profil_bitis_y,
    zone: req.autosan.body.zone,
    datum: req.autosan.body.datum,
    besyuzbin: req.autosan.body.besyuzbin,
    yuzbin: req.autosan.body.yuzbin,
    yirmibesbin: req.autosan.body.yirmibesbin,
    olculen_parametre_ler: req.autosan.body.olculen_parametre_ler,
    acilim_yonu: req.autosan.body.acilim_yonu,
    acilim_yontemi: req.autosan.body.acilim_yontemi,
    frekans_araligi: req.autosan.body.frekans_araligi,
    mt_olcu_suresisaat: req.autosan.body.mt_olcu_suresisaat,
    z_bileseni: req.autosan.body.z_bileseni,
    amt_olcusu: req.autosan.body.amt_olcusu,
    amt_olcu_suresi: req.autosan.body.amt_olcu_suresi,
    tem_olcusu: req.autosan.body.tem_olcusu,
    kalibrasyon_dosyasi: req.autosan.body.kalibrasyon_dosyasi,
    veri_formati: req.autosan.body.veri_formati,
    ab2_m: req.autosan.body.ab2_m,
    derinlik_m_gr: req.autosan.body.derinlik_m_gr,
    derinlik_m_neu: req.autosan.body.derinlik_m_neu,
    derinlik_m_den: req.autosan.body.derinlik_m_den,
    derinlik_m_res: req.autosan.body.derinlik_m_res,
    derinlik_m_sp: req.autosan.body.derinlik_m_sp,
    derinlik_m_cal: req.autosan.body.derinlik_m_cal,
    derinlik_m_term: req.autosan.body.derinlik_m_term,
    derinlik_m_sgr: req.autosan.body.derinlik_m_sgr,
    derinlik_m_cbl: req.autosan.body.derinlik_m_cbl,
    derinlik_m_son: req.autosan.body.derinlik_m_son,
    derinlik_m_ccl: req.autosan.body.derinlik_m_ccl,
    kayit_boyu_sn: req.autosan.body.kayit_boyu_sn,
    sweep_suresi_sn: req.autosan.body.sweep_suresi_sn,
    sweep_tipi: req.autosan.body.sweep_tipi,
    sweep_sayisi: req.autosan.body.sweep_sayisi,
    sweep_frekanslari_sn_hz: req.autosan.body.sweep_frekanslari_sn_hz,
    sweep_taper_ms: req.autosan.body.sweep_taper_ms,
    yayim_tipi: req.autosan.body.yayim_tipi,
    offsetm: req.autosan.body.offsetm,
    jeofon_dizilimi: req.autosan.body.jeofon_dizilimi,
    grup_araligim: req.autosan.body.grup_araligim,
    atis_araligim: req.autosan.body.atis_araligim,
    ornekleme_araligim: req.autosan.body.ornekleme_araligim,
    ekipman: req.autosan.body.ekipman,
    enerji_kaynagi: req.autosan.body.enerji_kaynagi,
    km2: req.autosan.body.km2,
    profil_boyukm: req.autosan.body.profil_boyukm,
    elektrot_araligi: req.autosan.body.elektrot_araligi,
    dizilim_turu: req.autosan.body.dizilim_turu,
    seviye_sayisi: req.autosan.body.seviye_sayisi,
    profil_araligi: req.autosan.body.profil_araligi,
    a_1: req.autosan.body.a_1,
    a_2: req.autosan.body.a_2,
    a_3: req.autosan.body.a_3,
    a_4: req.autosan.body.a_4,
    olcu_karne_no: req.autosan.body.olcu_karne_no,
    dis_loop_boyutu: req.autosan.body.dis_loop_boyutu,
    published: req.autosan.body.published ? req.body.published : false,
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { page, size, il, ilce, status } = req.query;
  console.log(req.query);
  const { limit, offset } = getPagination(page, size);
  const fields = Object.keys(
    _.pick(Tutorial.rawAttributes, [
      "nokta_adi",
      "calisma_amaci",
      "il",
      "ilce",
      "yontem",
      "alt_yontem",
    ])
  );
  const filters = {};

  fields.forEach((item) => (filters[item] = { [Op.iLike]: `%${il}%` }));

  var conditionIl = il ? { [Op.or]: filters } : null;
  if (ilce) {
    conditionIl = il
      ? { il: { [Op.like]: `%${il}%` }, ilce: { [Op.like]: `%${ilce}%` } }
      : null;
  }

  if (status == "user") {
    conditionIl = { ...conditionIl, published: true };
  }
  Tutorial.findAndCountAll({ where: conditionIl, limit, offset })
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
  const { il, ilce, yontem, alt_yontem, status } = req.query;

  var conditionCity = il ? { il: { [Op.like]: `%${il}%` } } : null;
  var conditionDistrict = ilce ? { ilce: { [Op.like]: `%${ilce}%` } } : null;
  var conditionMethod = yontem ? { yontem: { [Op.or]: yontem } } : null;

  var conditionSubMethod = alt_yontem
    ? { alt_yontem: { [Op.like]: `%${alt_yontem}%` } }
    : null;
  var conditionStatus = null;
  if (status == "user") {
    conditionStatus = { published: true };
  }
  Tutorial.findAll({
    where: Object.assign(
      {},
      conditionCity,
      conditionDistrict,
      conditionMethod,
      conditionSubMethod,
      conditionStatus ? conditionStatus : null
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

  Tutorial.update(req.autosan.body, {
    where: { id: id },
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

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
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
