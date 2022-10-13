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
    nokta_adi: req.autosan.body.nokta_adi ? req.autosan.body.nokta_adi : null,
    yontem: req.autosan.body.yontem ? req.autosan.body.yontem : null,
    alt_yontem: req.autosan.body.alt_yontem
      ? req.autosan.body.alt_yontem
      : null,
    calisma_amaci: req.autosan.body.calisma_amaci
      ? req.autosan.body.calisma_amaci
      : null,
    satilabilirlik: req.autosan.body.satilabilirlik
      ? req.autosan.body.satilabilirlik
      : null,
    ham_veri: req.autosan.body.ham_veri ? req.autosan.body.ham_veri : null,
    calisma_tarihi: req.autosan.body.calisma_tarihi
      ? req.autosan.body.calisma_tarihi.toString()
      : null,
    proje_kodu: req.autosan.body.proje_kodu
      ? req.autosan.body.proje_kodu
      : null,
    kuyu_arsiv_no:
      req.autosan.body.kuyu_arsiv_no !== null
        ? req.autosan.body.kuyu_arsiv_no.toString()
        : null,
    jeofizik_arsiv_no:
      req.autosan.body.jeofizik_arsiv_no !== null
        ? req.autosan.body.jeofizik_arsiv_no.toString()
        : null,
    derleme_no:
      req.autosan.body.derleme_no !== null
        ? req.autosan.body.derleme_no.toString()
        : null,
    cd_no:
      req.autosan.body.cd_no !== null
        ? req.autosan.body.cd_no.toString()
        : null,
    il: req.autosan.body.il ? req.autosan.body.il : null,
    ilce: req.autosan.body.ilce ? req.autosan.body.ilce : null,
    x: req.autosan.body.x !== null ? req.autosan.body.x.toString() : null,
    y: req.autosan.body.y !== null ? req.autosan.body.y.toString() : null,
    z: req.autosan.body.z !== null ? req.autosan.body.z.toString() : null,
    profil_baslangic_x:
      req.autosan.body.profil_baslangic_x !== null
        ? req.autosan.body.profil_baslangic_x.toString()
        : null,
    profil_baslangic_y:
      req.autosan.body.profil_baslangic_y !== null
        ? req.autosan.body.profil_baslangic_y.toString()
        : null,
    profil_bitis_x:
      req.autosan.body.profil_bitis_x !== null
        ? req.autosan.body.profil_bitis_x.toString()
        : null,
    profil_bitis_y:
      req.autosan.body.profil_bitis_y !== null
        ? req.autosan.body.profil_bitis_y.toString()
        : null,
    zone: req.autosan.body.zone ? req.autosan.body.zone : null,
    datum:
      req.autosan.body.datum !== null
        ? req.autosan.body.datum.toString()
        : null,
    besyuzbin:
      req.autosan.body.besyuzbin !== null
        ? req.autosan.body.besyuzbin.toString()
        : null,
    yuzbin:
      req.autosan.body.yuzbin !== null
        ? req.autosan.body.yuzbin.toString()
        : null,
    yirmibesbin:
      req.autosan.body.yirmibesbin !== null
        ? req.autosan.body.yirmibesbin.toString()
        : null,
    olculen_parametre_ler:
      req.autosan.body.olculen_parametre_ler !== null
        ? req.autosan.body.olculen_parametre_ler.toString()
        : null,
    acilim_yonu:
      req.autosan.body.acilim_yonu !== null
        ? req.autosan.body.acilim_yonu.toString()
        : null,
    acilim_yontemi:
      req.autosan.body.acilim_yontemi !== null
        ? req.autosan.body.acilim_yontemi.toString()
        : null,
    frekans_araligi:
      req.autosan.body.frekans_araligi !== null
        ? req.autosan.body.frekans_araligi.toString()
        : null,
    mt_olcu_suresisaat:
      req.autosan.body.mt_olcu_suresisaat !== null
        ? req.autosan.body.mt_olcu_suresisaat.toString()
        : null,
    z_bileseni:
      req.autosan.body.z_bileseni !== null
        ? req.autosan.body.z_bileseni.toString()
        : null,
    amt_olcusu:
      req.autosan.body.amt_olcusu !== null
        ? req.autosan.body.amt_olcusu.toString()
        : null,
    amt_olcu_suresi:
      req.autosan.body.amt_olcu_suresi !== null
        ? req.autosan.body.amt_olcu_suresi.toString()
        : null,
    tem_olcusu:
      req.autosan.body.tem_olcusu !== null
        ? req.autosan.body.tem_olcusu.toString()
        : null,
    kalibrasyon_dosyasi:
      req.autosan.body.kalibrasyon_dosyasi !== null
        ? req.autosan.body.kalibrasyon_dosyasi.toString()
        : null,
    veri_formati:
      req.autosan.body.veri_formati !== null
        ? req.autosan.body.veri_formati.toString()
        : null,
    ab2_m: req.autosan.body.ab2_m !== null ? req.autosan.body.ab2_m : null,
    derinlik_m_gr:
      req.autosan.body.derinlik_m_gr !== null
        ? req.autosan.body.derinlik_m_gr.toString()
        : null,
    derinlik_m_neu:
      req.autosan.body.derinlik_m_neu !== null
        ? req.autosan.body.derinlik_m_neu.toString()
        : null,
    derinlik_m_den:
      req.autosan.body.derinlik_m_den !== null
        ? req.autosan.body.derinlik_m_den.toString()
        : null,
    derinlik_m_res:
      req.autosan.body.derinlik_m_res !== null
        ? req.autosan.body.derinlik_m_res.toString()
        : null,
    derinlik_m_sp:
      req.autosan.body.derinlik_m_sp !== null
        ? req.autosan.body.derinlik_m_sp.toString()
        : null,
    derinlik_m_cal:
      req.autosan.body.derinlik_m_cal !== null
        ? req.autosan.body.derinlik_m_cal.toString()
        : null,
    derinlik_m_term:
      req.autosan.body.derinlik_m_term !== null
        ? req.autosan.body.derinlik_m_term.toString()
        : null,
    derinlik_m_sgr:
      req.autosan.body.derinlik_m_sgr !== null
        ? req.autosan.body.derinlik_m_sgr.toString()
        : null,
    derinlik_m_cbl:
      req.autosan.body.derinlik_m_cbl !== null
        ? req.autosan.body.derinlik_m_cbl.toString()
        : null,
    derinlik_m_son:
      req.autosan.body.derinlik_m_son !== null
        ? req.autosan.body.derinlik_m_son.toString()
        : null,
    derinlik_m_ccl:
      req.autosan.body.derinlik_m_ccl !== null
        ? req.autosan.body.derinlik_m_ccl.toString()
        : null,
    kayit_boyu_sn:
      req.autosan.body.kayit_boyu_sn !== null
        ? req.autosan.body.kayit_boyu_sn.toString()
        : null,
    sweep_suresi_sn:
      req.autosan.body.sweep_suresi_sn !== null
        ? req.autosan.body.sweep_suresi_sn.toString()
        : null,
    sweep_tipi:
      req.autosan.body.sweep_tipi !== null
        ? req.autosan.body.sweep_tipi.toString()
        : null,
    sweep_sayisi:
      req.autosan.body.sweep_sayisi !== null
        ? req.autosan.body.sweep_sayisi.toString()
        : null,
    sweep_frekanslari_sn_hz:
      req.autosan.body.sweep_frekanslari_sn_hz !== null
        ? req.autosan.body.sweep_frekanslari_sn_hz.toString()
        : null,
    sweep_taper_ms:
      req.autosan.body.sweep_taper_ms !== null
        ? req.autosan.body.sweep_taper_ms.toString()
        : null,
    yayim_tipi:
      req.autosan.body.yayim_tipi !== null
        ? req.autosan.body.yayim_tipi.toString()
        : null,
    ofsetm:
      req.autosan.body.ofsetm !== null
        ? req.autosan.body.ofsetm.toString()
        : null,
    jeofon_dizilimi:
      req.autosan.body.jeofon_dizilimi !== null
        ? req.autosan.body.jeofon_dizilimi.toString()
        : null,
    grup_araligim:
      req.autosan.body.grup_araligim !== null
        ? req.autosan.body.grup_araligim.toString()
        : null,
    atis_araligim:
      req.autosan.body.atis_araligim !== null
        ? req.autosan.body.atis_araligim.toString()
        : null,
    ornekleme_araligim:
      req.autosan.body.ornekleme_araligim !== null
        ? req.autosan.body.ornekleme_araligim.toString()
        : null,
    ekipman: req.autosan.body.ekipman ? req.autosan.body.ekipman : null,
    enerji_kaynagi: req.autosan.body.enerji_kaynagi
      ? req.autosan.body.enerji_kaynagi
      : null,
    km2: req.autosan.body.km2 !== null ? req.autosan.body.km2 : null,
    profil_boyukm:
      req.autosan.body.profil_boyukm !== null
        ? req.autosan.body.profil_boyukm.toString()
        : null,
    elektrot_araligi:
      req.autosan.body.elektrot_araligi !== null
        ? req.autosan.body.elektrot_araligi.toString()
        : null,
    dizilim_turu: req.autosan.body.dizilim_turu
      ? req.autosan.body.dizilim_turu
      : null,
    seviye_sayisi:
      req.autosan.body.seviye_sayisi !== null
        ? req.autosan.body.seviye_sayisi.toString()
        : null,
    profil_araligi:
      req.autosan.body.profil_araligi !== null
        ? req.autosan.body.profil_araligi.toString()
        : null,
    a_1: req.autosan.body.a_1 !== null ? req.autosan.body.a_1.toString() : null,
    a_2: req.autosan.body.a_2 !== null ? req.autosan.body.a_2.toString() : null,
    a_3: req.autosan.body.a_3 !== null ? req.autosan.body.a_3.toString() : null,
    a_4: req.autosan.body.a_4 !== null ? req.autosan.body.a_4.toString() : null,
    olcu_karne_no:
      req.autosan.body.olcu_karne_no !== null
        ? req.autosan.body.olcu_karne_no.toString()
        : null,
    dis_loop_boyutu:
      req.autosan.body.dis_loop_boyutu !== null
        ? req.autosan.body.dis_loop_boyutu.toString()
        : null,
    published: req.autosan.body.published ? req.body.published : false,
    lat: req.autosan.body.lat ? req.autosan.body.lat : null,
    lon: req.autosan.body.lon ? req.autosan.body.lon : null,
    editorname: req.autosan.body.editorname
      ? req.autosan.body.editorname
      : null,
  };
  //findorcreate tutorial if the entry is not found in the database
  //https://sequelize.org/master/manual/model-querying-basics.html
  //https://sequelize.org/master/manual/model-querying-basics.html#-code-findorcreate--code----search-for-a-specific-element-or-create-it-if-not-available
  Tutorial.findOrCreate({
    where: tutorial,
    attributes: { exclude: ["id"] },
  })
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

// Save Tutorial in the database if the entry does not
// Tutorial.create(tutorial)
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while creating the Tutorial.",
//     });
//   });

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { page, size, il, ilce, yontem, userStatus, areaJson } = req.query;
  const { limit, offset } = getPagination(page, size);
  var filters = {};
  var condition = null;

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
  var conditionStatus = null;
  if (userStatus == "user") {
    conditionStatus = { published: true };
  }
  var conditionMethod = {
    [Op.or]: [
      { yontem: { [Op.or]: yontem } },
      { alt_yontem: { [Op.or]: yontem } },
    ],
  };
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
    where: [locationCondition, conditionMethod, conditionStatus],
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
