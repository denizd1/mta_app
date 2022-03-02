const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

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
  if (!req.body.nokta_adi) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    nokta_adi: req.body.nokta_adi,
    yontem: req.body.yontem,
    alt_yontem: req.body.alt_yontem,
    calisma_amaci: req.body.calisma_amaci,
    satilabilirlik: req.body.satilabilirlik,
    ham_veri: req.body.ham_veri,
    calisma_tarihi: req.body.calisma_tarihi,
    proje_kodu: req.body.proje_kodu,
    kuyu_arsiv_no: req.body.kuyu_arsiv_no,
    jeofizik_arsiv_no: req.body.jeofizik_arsiv_no,
    derleme_no: req.body.derleme_no,
    cd_no: req.body.cd_no,
    il: req.body.il,
    ilce: req.body.ilce,
    x: req.body.x,
    y: req.body.y,
    z: req.body.z,
    profil_baslangic_x: req.body.profil_baslangic_x,
    profil_baslangic_y: req.body.profil_baslangic_y,
    profil_bitis_x: req.body.profil_bitis_x,
    profil_bitis_y: req.body.profil_bitis_y,
    zone: req.body.zone,
    datum: req.body.datum,
    besyuzbin: req.body.besyuzbin,
    yuzbin: req.body.yuzbin,
    yirmibesbin: req.body.yirmibesbin,
    olculen_parametre_ler: req.body.olculen_parametre_ler,
    acilim_yonu: req.body.acilim_yonu,
    acilim_yontemi: req.body.acilim_yontemi,
    frekans_araligi: req.body.frekans_araligi,
    mt_olcu_suresisaat: req.body.mt_olcu_suresisaat,
    z_bileseni: req.body.z_bileseni,
    amt_olcusu: req.body.amt_olcusu,
    amt_olcu_suresi: req.body.amt_olcu_suresi,
    tem_olcusu: req.body.tem_olcusu,
    kalibrasyon_dosyasi: req.body.kalibrasyon_dosyasi,
    veri_formati: req.body.veri_formati,
    ab2_m: req.body.ab2_m,
    derinlik_m_gr: req.body.derinlik_m_gr,
    derinlik_m_neu: req.body.derinlik_m_neu,
    derinlik_m_den: req.body.derinlik_m_den,
    derinlik_m_res: req.body.derinlik_m_res,
    derinlik_m_sp: req.body.derinlik_m_sp,
    derinlik_m_cal: req.body.derinlik_m_cal,
    derinlik_m_term: req.body.derinlik_m_term,
    derinlik_m_sgr: req.body.derinlik_m_sgr,
    derinlik_m_cbl: req.body.derinlik_m_cbl,
    derinlik_m_son: req.body.derinlik_m_son,
    derinlik_m_ccl: req.body.derinlik_m_ccl,
    kayit_boyu_sn: req.body.kayit_boyu_sn,
    sweep_suresi_sn: req.body.sweep_suresi_sn,
    sweep_tipi: req.body.sweep_tipi,
    sweep_sayisi: req.body.sweep_sayisi,
    sweep_frekanslari_sn_hz: req.body.sweep_frekanslari_sn_hz,
    sweep_taper_ms: req.body.sweep_taper_ms,
    yayim_tipi: req.body.yayim_tipi,
    offsetm: req.body.offsetm,
    jeofon_dizilimi: req.body.jeofon_dizilimi,
    grup_araligim: req.body.grup_araligim,
    atis_araligim: req.body.atis_araligim,
    ornekleme_araligim: req.body.ornekleme_araligim,
    ekipman: req.body.ekipman,
    enerji_kaynagi: req.body.enerji_kaynagi,
    km2: req.body.km2,
    profil_boyukm: req.body.profil_boyukm,
    elektrot_araligi: req.body.elektrot_araligi,
    dizilim_turu: req.body.dizilim_turu,
    seviye_sayisi: req.body.seviye_sayisi,
    profil_araligi: req.body.profil_araligi,
    a_1: req.body.a_1,
    a_2: req.body.a_2,
    a_3: req.body.a_3,
    a_4: req.body.a_4,
    olcu_karne_no: req.body.olcu_karne_no,
    dis_loop_boyutu: req.body.dis_loop_boyutu,
    published: req.body.published ? req.body.published : false
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { page, size, il } = req.query;

  var condition = il ? { il: { [Op.like]: `%${il}%` } } : null;
  
  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

exports.findAllgetAll=(req,res)=>{
  const { il,ilce,yontem,alt_yontem } = req.query;
  
  var conditionCity = il ? { il: { [Op.like]: `%${il}%` } } : null;
  var conditionDistrict = ilce ? { ilce: { [Op.like]: `%${ilce}%` } } : null;
  var conditionMethod =  yontem ? { yontem: { [Op.or]: yontem } } : null;

  var conditionSubMethod = alt_yontem ? { alt_yontem: { [Op.like]: `%${alt_yontem}%` } } : null;
  Tutorial.findAll({ where: Object.assign({}, conditionCity, conditionDistrict, conditionMethod, conditionSubMethod), })
    .then(data => {
     
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({ where: { published: true }, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};