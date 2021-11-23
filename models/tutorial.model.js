module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    nokta_adi: {
      type: Sequelize.STRING
    },
    yontem: {
      type: Sequelize.STRING
    },
    alt_yontem: {
      type: Sequelize.STRING
    },
    calisma_amaci: {
      type: Sequelize.STRING
    },
    satilabilirlik: {
      type: Sequelize.STRING
    },
    ham_veri: {
      type: Sequelize.STRING
    },
    calisma_tarihi: {
      type: Sequelize.DATE
    },
    proje_kodu: {
      type: Sequelize.STRING
    },
    rapor_no: {
      type: Sequelize.STRING
    },
    kuyu_arsiv_no: {
      type: Sequelize.STRING
    },
    jeofizik_arsiv_no: {
      type: Sequelize.INTEGER
    },
    derleme_no: {
      type: Sequelize.INTEGER
    },
    cd_no: {
      type: Sequelize.STRING
    },
    il: {
      type: Sequelize.STRING
    },
    ilce: {
      type: Sequelize.STRING
    },
    x: {
      type: Sequelize.INTEGER
    },
    y: {
      type: Sequelize.INTEGER
    },
    z: {
      type: Sequelize.INTEGER
    },
    profil_baslangic_x: {
      type: Sequelize.STRING
    },
    profil_baslangic_y: {
      type: Sequelize.STRING
    },
    profil_bitis_x: {
      type: Sequelize.STRING
    },
    profil_bitis_y: {
      type: Sequelize.STRING
    },
    zone: {
      type: Sequelize.INTEGER
    },
    datum: {
      type: Sequelize.STRING
    },
    besyuzbin: {
      type: Sequelize.STRING
    },
    yuzbin: {
      type: Sequelize.STRING
    },
    yirmibesbin: {
      type: Sequelize.STRING
    },
    olculen_parametre_ler: {
      type: Sequelize.STRING
    },
    acilim_yonu: {
      type: Sequelize.STRING
    },
    acilim_yontemi: {
      type: Sequelize.STRING
    },
    frekans_araligi: {
      type: Sequelize.STRING
    },
    mt_olcu_suresisaat: {
      type: Sequelize.STRING
    },
    z_bileseni: {
      type: Sequelize.STRING
    },
    amt_olcusu: {
      type: Sequelize.STRING
    },
    amt_olcu_suresi: {
      type: Sequelize.STRING
    },
    tem_olcusu: {
      type: Sequelize.STRING
    },
    kalibrasyon_dosyasi: {
      type: Sequelize.STRING
    },
    veri_formati: {
      type: Sequelize.STRING
    },
    ab2_m: {
      type: Sequelize.STRING
    },
    derinlik_m_gr: {
      type: Sequelize.STRING
    },
    derinlik_m_neu: {
      type: Sequelize.STRING
    },
    derinlik_m_den: {
      type: Sequelize.STRING
    },
    derinlik_m_res: {
      type: Sequelize.STRING
    },
    derinlik_m_sp: {
      type: Sequelize.STRING
    },
    derinlik_m_cal: {
      type: Sequelize.STRING
    },
    derinlik_m_term: {
      type: Sequelize.STRING
    },
    derinlik_m_sgr: {
      type: Sequelize.STRING
    },
    derinlik_m_cbl: {
      type: Sequelize.STRING
    },
    derinlik_m_son: {
      type: Sequelize.STRING
    },
    derinlik_m_ccl: {
      type: Sequelize.STRING
    },
    hat_boyu_m: {
      type: Sequelize.STRING
    },
    kayit_boyu_sn: {
      type: Sequelize.STRING
    },
    sweep_suresi_sn: {
      type: Sequelize.STRING
    },
    sweep_tipi: {
      type: Sequelize.STRING
    },
    sweep_sayisi: {
      type: Sequelize.STRING
    },
    sweep_frekanslari_sn_hz: {
      type: Sequelize.STRING
    },
    sweep_taper_ms: {
      type: Sequelize.STRING
    },
    yayim_tipi: {
      type: Sequelize.STRING
    },
    ofsetm: {
      type: Sequelize.STRING
    },
    jeofon_dizilimi: {
      type: Sequelize.STRING
    },
    grup_araligim: {
      type: Sequelize.STRING
    },
    atis_araligim: {
      type: Sequelize.STRING
    },
    ornekleme_araligim: {
      type: Sequelize.STRING
    },
    ekipman: {
      type: Sequelize.STRING
    },
    enerji_kaynagi: {
      type: Sequelize.STRING
    },
    km2: {
      type: Sequelize.STRING
    },
    profil_boyukm: {
      type: Sequelize.STRING
    },
    elektrot_araligi: {
      type: Sequelize.STRING
    },
    dizilim_turu: {
      type: Sequelize.STRING
    },
    seviye_sayisi: {
      type: Sequelize.STRING
    },
    profil_araligi: {
      type: Sequelize.STRING
    },
    a_1: {
      type: Sequelize.STRING
    },
    a_2: {
      type: Sequelize.STRING
    },
    a_3: {
      type: Sequelize.STRING
    },
    a_4: {
      type: Sequelize.STRING
    },
    dis_loop_boyutu: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }
  });

  return Tutorial;
};