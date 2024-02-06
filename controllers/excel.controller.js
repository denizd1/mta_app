const db = require("../models");
const fs = require("fs");
const Tutorial = db.tutorials;
const citiesLatLongjson = require("../cities_of_turkey.json");
const readXlsxFile = require("read-excel-file/node");
const utmObj = require("utm-latlng");
const centerofmass = require("@turf/center-of-mass");
const booleanPointInPolygon = require("@turf/boolean-point-in-polygon");
const booleanIntersects = require("@turf/boolean-intersects");
const intersection = require("@turf/intersect");
const turfpolygon = require("turf-polygon");
const turfmultiPolygon = require("turf-multipolygon");
const turflinestring = require("turf-linestring");
var pafta25000 = JSON.parse(fs.readFileSync("pafta25000.geojson"));
var pafta100000 = JSON.parse(fs.readFileSync("pafta100000.geojson"));
var pafta500000 = JSON.parse(fs.readFileSync("pafta500000.geojson"));
var cities = JSON.parse(fs.readFileSync("tr-cities-utf8.geojson"));
var districts = JSON.parse(fs.readFileSync("tr_ilce.geojson"));

const fileHeader = [
  "nokta_adi",
  "yontem",
  "alt_yontem",
  "calisma_amaci",
  "satilabilirlik",
  "ham_veri",
  "calisma_tarihi",
  "proje_kodu",
  "kuyu_arsiv_no",
  "jeofizik_arsiv_no",
  "derleme_no",
  "cd_no",
  "il",
  "ilce",
  "x",
  "y",
  "z",
  "profil_baslangic_x",
  "profil_baslangic_y",
  "profil_bitis_x",
  "profil_bitis_y",
  "zone",
  "datum",
  "besyuzbin",
  "yuzbin",
  "yirmibesbin",
  "olculen_parametre_ler",
  "acilim_yonu",
  "acilim_yontemi",
  "frekans_araligi",
  "mt_olcu_suresisaat",
  "z_bileseni",
  "amt_olcusu",
  "amt_olcu_suresi",
  "tem_olcusu",
  "kalibrasyon_dosyasi",
  "veri_formati",
  "ab2_m",
  "derinlik_m_gr",
  "derinlik_m_neu",
  "derinlik_m_den",
  "derinlik_m_res",
  "derinlik_m_sp",
  "derinlik_m_cal",
  "derinlik_m_term",
  "derinlik_m_sgr",
  "derinlik_m_cbl",
  "derinlik_m_son",
  "derinlik_m_ccl",
  "hat_boyu_m",
  "kayit_boyu_sn",
  "sweep_suresi_sn",
  "sweep_tipi",
  "sweep_sayisi",
  "sweep_frekanslari_sn_hz",
  "sweep_taper_ms",
  "yayim_tipi",
  "ofsetm",
  "jeofon_dizilimi",
  "grup_araligim",
  "atis_araligim",
  "ornekleme_araligim",
  "ekipman",
  "enerji_kaynagi",
  "km2",
  "profil_boyukm",
  "elektrot_araligi",
  "dizilim_turu",
  "seviye_sayisi",
  "profil_araligi",
  "a_1",
  "a_2",
  "a_3",
  "a_4",
  "olcu_karne_no",
  "dis_loop_boyutu",
];

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).json({
        message: "File exists or empty",
      });
    }
    let path = __basedir + "/app/uploads/" + req.file.filename;

    readXlsxFile(path, { sheet: 2 })
      .then((rows) => {
        // skip header
        rows.shift();

        let tutorials = [];

        rows.forEach((row) => {
          tutorials.push(importData(row, req.body.user));
        });

        Tutorial.bulkCreate(tutorials)
          .then((data) => {
            res.status(200).json({
              message: "Successfully created",
              data: data,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      });
  } catch (e) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
//check if point is in polygon. If yes then return yirmibes, yuz, besyuz, il, ilce
const checkPointInPolygon = (lat, lon) => {
  const isInside25 = pafta25000.features.find((polygon) =>
    booleanPointInPolygon.default([lat, lon], polygon.geometry)
  );
  const isInside100 = pafta100000.features.find((polygon) =>
    booleanPointInPolygon.default([lat, lon], polygon.geometry)
  );
  const isInside500 = pafta500000.features.find((polygon) =>
    booleanPointInPolygon.default([lat, lon], polygon.geometry)
  );
  const isInsideCity = cities.features.find((polygon) =>
    booleanPointInPolygon.default([lat, lon], polygon.geometry)
  );
  const isInsideDistrict = districts.features.find((polygon) =>
    booleanPointInPolygon.default([lat, lon], polygon.geometry)
  );

  var thisyirmibes = isInside25.properties.STD_ID1.toUpperCase();
  var thisyuz = isInside100.properties.STD_ID1;
  var thisbesyuz = isInside500.properties.name;
  var thisil =
    isInsideCity.properties.name.charAt(0) +
    isInsideCity.properties.name.substring(1).toLocaleLowerCase("tr");
  var thisilce =
    isInsideDistrict.properties.STD_ID1.charAt(0) +
    isInsideDistrict.properties.STD_ID1.substring(1).toLocaleLowerCase("tr");

  return {
    yirmibes: thisyirmibes,
    yuz: thisyuz,
    besyuz: thisbesyuz,
    il: thisil,
    ilce: thisilce,
  };
};
//check if polygon intersects with other polygons. If yes then return yirmibes, yuz, besyuz, il, ilce
const intersectionCheck = (inputpoly) => {
  var pafta25list = [];
  var pafta100list = [];
  var pafta500list = [];
  var citylist = [];
  var districtlist = [];

  pafta25000.features.forEach((polygon) => {
    if (
      intersection.default(
        turfpolygon(polygon.geometry.coordinates),
        turfpolygon(inputpoly.features[0].geometry.coordinates)
      )
    ) {
      pafta25list.push(polygon.properties.STD_ID1.toUpperCase());
    }
  });
  pafta100000.features.forEach((polygon) => {
    if (
      intersection.default(
        turfpolygon(polygon.geometry.coordinates),
        turfpolygon(inputpoly.features[0].geometry.coordinates)
      )
    ) {
      pafta100list.push(polygon.properties.STD_ID1);
    }
  });
  pafta500000.features.forEach((polygon) => {
    if (
      intersection.default(
        turfpolygon(polygon.geometry.coordinates),
        turfpolygon(inputpoly.features[0].geometry.coordinates)
      )
    ) {
      pafta500list.push(polygon.properties.STD_ID1);
    }
  });
  cities.features.forEach((polygon) => {
    if (
      intersection.default(
        turfmultiPolygon(polygon.geometry.coordinates),
        turfpolygon(inputpoly.features[0].geometry.coordinates)
      )
    ) {
      citylist.push(
        polygon.properties.name.charAt(0) +
          polygon.properties.name.substring(1).toLocaleLowerCase("tr")
      );
    }
  });
  districts.features.forEach((polygon) => {
    if (
      intersection.default(
        turfmultiPolygon(polygon.geometry.coordinates),
        turfpolygon(inputpoly.features[0].geometry.coordinates)
      )
    ) {
      districtlist.push(
        polygon.properties.STD_ID1.charAt(0) +
          polygon.properties.STD_ID1.substring(1).toLocaleLowerCase("tr")
      );
    }
  });

  return {
    yirmibes: pafta25list,
    yuz: pafta100list,
    besyuz: pafta500list,
    il: citylist,
    ilce: districtlist,
  };
};
//check if line intersects with polygon. If yes then return yirmibes, yuz, besyuz, il, ilce
const intersectionCheckLine = (line) => {
  var pafta25list = [];
  var pafta100list = [];
  var pafta500list = [];
  var citylist = [];
  var districtlist = [];

  pafta25000.features.forEach((polygon) => {
    if (
      booleanIntersects.default(turfpolygon(polygon.geometry.coordinates), line)
    ) {
      pafta25list.push(polygon.properties.STD_ID1.toUpperCase());
    }
  });
  pafta100000.features.forEach((polygon) => {
    if (
      booleanIntersects.default(turfpolygon(polygon.geometry.coordinates), line)
    ) {
      pafta100list.push(polygon.properties.STD_ID1);
    }
  });
  pafta500000.features.forEach((polygon) => {
    if (
      booleanIntersects.default(turfpolygon(polygon.geometry.coordinates), line)
    ) {
      pafta500list.push(polygon.properties.STD_ID1);
    }
  });
  cities.features.forEach((polygon) => {
    if (
      booleanIntersects.default(
        turfmultiPolygon(polygon.geometry.coordinates),
        line
      )
    ) {
      citylist.push(
        polygon.properties.name.charAt(0) +
          polygon.properties.name.substring(1).toLocaleLowerCase("tr")
      );
    }
  });
  districts.features.forEach((polygon) => {
    if (
      booleanIntersects.default(
        turfmultiPolygon(polygon.geometry.coordinates),
        line
      )
    ) {
      districtlist.push(
        polygon.properties.STD_ID1.charAt(0) +
          polygon.properties.STD_ID1.substring(1).toLocaleLowerCase("tr")
      );
    }
  });

  return {
    yirmibes: pafta25list,
    yuz: pafta100list,
    besyuz: pafta500list,
    il: citylist,
    ilce: districtlist,
  };
};

const importData = (element, user) => {
  let data = {};
  Object.entries(element).forEach(([key, value], index) => {
    data[fileHeader[index]] = value;

    if (fileHeader[index] === "nokta_adi") {
      if (typeof value === "number") {
        value = value.toString();
      }
      data[fileHeader[index]] = value.includes("_")
        ? value.replace(/_/g, " ")
        : value;
    } else {
      var val = value ? replaceVal(value) : null;
      data[fileHeader[index]] = val; // key - value
    }
  });
  //if data["zone"] contains "," then split and convert to number, else convert to number
  if (data["zone"] === null || data["zone"] === undefined) {
    throw new Error("Zone bilgisini kontrol ediniz!");
  }
  if (typeof data["zone"] === "string" && data["zone"].includes(",")) {
    data["zone"] = data["zone"].split(",").map(Number);
  } else {
    data["zone"] = [parseInt(data["zone"])];
  }

  data["zone"] = data["zone"].map((zone) => {
    if (zone > 39 || zone < 35) {
      throw new Error("Zone bilgisini kontrol ediniz!");
    }
    return zone;
  });

  var latlon = null;
  var dummyCity = null;
  var thisCity = null;
  if (
    data["calisma_amaci"] !== "TÜRKİYE GENELİ HAVADAN JEOFİZİK ARAŞTIRMALAR"
  ) {
    if (data["il"] === null || data["il"] === undefined) {
      throw new Error("İl alanını kontrol ediniz.");
    } else {
      if (data["il"] !== null && data["il"] !== undefined) {
        if (data["il"].includes(",")) {
          dummyCity = data["il"].split(",")[0];
          thisCity = citiesLatLongjson.filter(
            (city) => city.il == dummyCity.trim()
          )[0];
        } else {
          dummyCity = data["il"];
          thisCity = citiesLatLongjson.filter(
            (city) => city.il == dummyCity.trim()
          )[0];
        }
        data["lat"] = parseFloat(thisCity.longitude);
        data["lon"] = parseFloat(thisCity.latitude);
      } else if (
        data["a_1"] === null &&
        data["a_2"] === null &&
        data["a_3"] === null &&
        data["a_4"] === null
      ) {
        //throw error to async upload function
        throw new Error("İl alanını kontrol ediniz.");
      }
    }
  }

  if (data["x"] !== null && data["y"] !== null) {
    latlon = converter(data["x"], data["y"], data["zone"], data["datum"]);
    data["lat"] = latlon.lng;
    data["lon"] = latlon.lat;

    var check = checkPointInPolygon(data["lat"], data["lon"]);
    data["besyuzbin"] = check.besyuz;
    data["yuzbin"] = check.yuz;
    data["yirmibesbin"] = check.yirmibes;
    data["il"] = check.il;
    data["ilce"] = check.ilce;
  }

  if (
    data["profil_baslangic_x"] !== null &&
    data["profil_baslangic_y"] !== null &&
    data["profil_bitis_x"] !== null &&
    data["profil_bitis_y"] !== null
  ) {
    var polyLineStart = converter(
      data["profil_baslangic_x"],
      data["profil_baslangic_y"],
      data["zone"].length > 1 ? data["zone"][0] : data["zone"][0],
      data["datum"]
    );
    var polyLineEnd = converter(
      data["profil_bitis_x"],
      data["profil_bitis_y"],
      data["zone"].length > 1 ? data["zone"][1] : data["zone"][0],
      data["datum"]
    );
    //make a line from start to end
    var line = turflinestring([
      [polyLineStart.lng, polyLineStart.lat],
      [polyLineEnd.lng, polyLineEnd.lat],
    ]);
    var check = intersectionCheckLine(line);
    data["yirmibesbin"] = check.yirmibes.join(", ");
    data["yuzbin"] = check.yuz.join(", ");
    data["besyuzbin"] = check.besyuz.join(", ");
    data["il"] = check.il.join(", ");
    data["ilce"] = check.ilce.join(", ");

    /*
     * Find midpoint between two coordinates points
     * Source : http://www.movable-type.co.uk/scripts/latlong.html
     */

    //-- Define radius function
    if (typeof Number.prototype.toRad === "undefined") {
      Number.prototype.toRad = function () {
        return (this * Math.PI) / 180;
      };
    }

    //-- Define degrees function
    if (typeof Number.prototype.toDeg === "undefined") {
      Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
      };
    }

    //-- Define middle point function

    //-- Longitude difference
    var dLng = (polyLineEnd.lng - polyLineStart.lng).toRad();

    //-- Convert to radians
    var lat1 = polyLineStart.lat.toRad();
    var lat2 = polyLineEnd.lat.toRad();
    var lng1 = polyLineStart.lng.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(
      Math.sin(lat1) + Math.sin(lat2),
      Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
    );
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);
    data["lat"] = lng3.toDeg();
    data["lon"] = lat3.toDeg();
  }

  if (
    data["a_1"] !== null &&
    data["a_2"] !== null &&
    data["a_3"] !== null &&
    data["a_4"] !== null
  ) {
    var corners = [data["a_1"], data["a_2"], data["a_3"], data["a_4"]]; //typeof string
    var coordinates = [];

    //need to convert string to number then convert utm to latlng
    for (let i = 0; i < corners.length; i++) {
      var corner = corners[i];
      var cornerCoordinates = corner.split(",");
      var x = parseFloat(cornerCoordinates[0]);
      var y = parseFloat(cornerCoordinates[1]);

      var cornerPoint = converter(
        x,
        y,
        data["zone"].length > 1 ? data["zone"][i] : data["zone"][0],
        data["datum"]
      );
      coordinates.push([cornerPoint.lng, cornerPoint.lat]);
    }

    var close = converter(
      parseFloat(corners[0].split(",")[0]),
      parseFloat(corners[0].split(",")[1]),
      data["zone"].length > 1 ? data["zone"][0] : data["zone"][0],
      data["datum"]
    );
    coordinates.push([parseFloat(close.lng), parseFloat(close.lat)]);
    var geoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            mytag: "datdat",
            name: "datdat",
            tessellate: true,
          },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      ],
    };
    var check = intersectionCheck(geoJson);
    //join array elements with whitespace and comma
    data["yirmibesbin"] = check.yirmibes.join(", ");
    data["yuzbin"] = check.yuz.join(", ");
    data["besyuzbin"] = check.besyuz.join(", ");
    data["il"] = check.il.join(", ");
    data["ilce"] = check.ilce.join(", ");
    1;

    var centerOfMass = centerofmass.default(geoJson);
    data["lat"] = centerOfMass.geometry.coordinates[0];
    data["lon"] = centerOfMass.geometry.coordinates[1];
  }
  if (typeof data["calisma_tarihi"] !== "string") {
    var regex = /^(181[2-9]|18[2-9]\d|19\d\d|2\d{3}|30[0-3]\d|304[0-8])$/;
    if (regex.test(data["calisma_tarihi"])) {
      data["calisma_tarihi"] = data["calisma_tarihi"].toString();
    } else {
      data["calisma_tarihi"] =
        data["calisma_tarihi"].getDate() +
        "/" +
        (data["calisma_tarihi"].getMonth() + 1) +
        "/" +
        data["calisma_tarihi"].getFullYear();
    }
  } else if (typeof data["calisma_tarihi"] === "string") {
    data["calisma_tarihi"] = data["calisma_tarihi"];
  } else {
    throw new Error("Çalışma tarihini kontrol ediniz.");
  }
  //   Object.entries(element).forEach(([key, value]) => {
  //     data[key] = replaceVal(value); // key - value
  //     if (key != "zone" || key != "lat" || key != "lon") {
  //       data[key] = value !== null ? value.toString() : null;
  //     }
  //   });
  //fetch pafta25000.geojson from root
  //check if point is in polygon
  //if not throw error
  //if yes then continue
  //if data["lat"] and data["lon"] is null then throw error
  //if data["lat"] and data["lon"] is not null then continue

  for (const [key, value] of Object.entries(data)) {
    // Skip processing for specified keys
    if (["il", "ilce", "yuzbin", "besyuzbin", "yirmibesbin"].includes(key)) {
      continue;
    }
    data[key] = replaceVal(value);

    data[key] = value !== null ? value.toString() : null;

    if (key === "lat" || key === "lon") {
      data[key] = value !== null ? parseFloat(value) : null;
    }
  }

  data["published"] = false;
  data["editorname"] = user.toString();
  return data;
};

const replaceVal = (value) => {
  switch (value) {
    case "POTANSıYEL_ALAN_YONTEMLERI":
      return "Potansiyel Alan Yöntemleri";
    case "ELEKTRIK_VE_ELEKTROMANYETIK_YONTEMLER":
      return "Elektrik ve Elektromanyetik Yöntemler";
    case "SISMIK_YONTEMLER":
      return "Sismik Yöntemler";
    case "KUYU_OLCULERI":
      return "Kuyu Ölçüleri";
    case "GRAVITE":
      return "Gravite";
    case "MANYETIK":
      return "Manyetik";
    case "HAVADAN MANYETIK":
      return "Havadan Manyetik";
    case "HAVADAN GRAVITE":
      return "Havadan Gravite";
    case "UYDU GORUNTUSU":
      return "uydu Görüntüsü";
    case "RADYOMETRI":
      return "Radyometri";
    case "SUSEPTIBILITE":
      return "Suseptibilite";
    case "DUSEY_ELEKTRIK_SONDAJI(DES)":
      return "Düşey Elektrik Sondajı (DES)";
    case "GECICI_ELEKTROMANYETIK_YONTEM(TEM)":
      return "Geçici Elektromanyetik Yöntem (TEM)";
    case "YAPAY_UCLASMA_YONTEMI(IP)":
      return "Yapay Uçlaşma Yöntemi (IP)";
    case "GRADIENT_YAPAY_UCLASMA_YONTEMI(IP)":
      return "Gradient Yapay Uçlaşma Yöntemi (IP)";
    case "MANYETO_TELLURIK(MT)":
      return "Manyetotellürik (MT)";
    case "AUDIO_MANYETO_TELLURIK(AMT)":
      return "Audio Manyetotellürik (AMT)";
    case "YAPAY_KAYNAKLI_AUDIO_MANYETO_TELLURIK(CSAMT)":
      return "Yapay Kaynaklı Audio Manyetotellürik (CSAMT)";
    case "DOGAL_POTANSIYEL(SP)":
      return "Doğal Potansiyel (SP)";
    case "COK_KANALLI_OZDIRENC_YONTEMI":
      return "Çok Kanallı Özdirenç Yöntemi";
    case "2_BOYUTLU_SISMIK_YANSIMA":
      return "2 Boyutlu Sismik Yansıma";
    case "2_BOYUTLU_SISMIK_KIRILMA":
      return "2 Boyutlu Sismik Kırılma";
    case "YER_RADARI":
      return "Yer Radarı";
    case "GAMMA_RAY(GR)":
      return "Gamma Ray (Gr)";
    case "NEUTRON(NEU)":
      return "Neutron (Neu)";
    case "DENSITY(DEN)":
      return "Density (Den)";
    case "RESISTVITY(RES)":
      return "Resistivity (Res)";
    case "SELF_POTANTIAL(SP)":
      return "Self Potential (SP)";
    case "CALIPER(CAL)":
      return "Caliper (Cal)";
    case "SICAKLIK_LOGU(TERM)":
      return "Sıcaklık Logu (Term)";
    case "SPEKTRAL_GAMMARAY(SGR)":
      return "Spektral Gammaray (SGR)";
    case "CIMENTO_LOGU(CBL)":
      return "Çimento Logu (Cbl)";
    case "SONIC_LOG(SON)":
      return "Sonic Log (Son)";
    case "CASING_COLLOR_LOCATOR(CCL)":
      return "Casing Collor Locator (CCL)";
    case "BIRLESIK_LOG":
      return "Birleşik Log";
    case "LİNEER":
      return "Lineer";
    case "SATILABILIR":
      return "Satılabilir";
    case "RADYOAKTİF HAMMADDE":
      return "Radyoaktif Hammadde";
    case "KOMUR":
      return "Kömür";
    case "JEOTERMAL":
      return "Jeotermal";
    case "VAR":
      return "Var";
    case "YOK":
      return "Yok";
    default:
      return value;
  }
};

const converter = (x, y, zone, datum) => {
  if (
    x !== null &&
    x !== undefined &&
    y !== null &&
    y !== undefined &&
    zone !== null &&
    zone !== undefined &&
    datum !== null &&
    datum !== undefined
  ) {
    var utm = null;
    if (datum === "WGS_84") {
      utm = new utmObj("WGS 84");
    } else if (datum === "ED_50") {
      utm = new utmObj("ED50");
    } else {
      throw new Error("Datum bilgisini kontrol ediniz!");
    }
    var point = utm.convertUtmToLatLng(x, y, zone, "N");

    return point;
  } else {
    throw new Error("Koordinat bilgilerini kontrol ediniz.");
  }
};

module.exports = {
  upload,
};
