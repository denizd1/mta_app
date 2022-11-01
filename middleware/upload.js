const multer = require("multer");
const fs = require("fs");
const path = require("path");

const excelFilter = (req, file, cb) => {
  if (
    fs.existsSync(path.join(__basedir + "/app/uploads/", file.originalname))
  ) {
    //throw error if file already exists

    return cb(null, false);
  }
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;
