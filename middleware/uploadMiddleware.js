const multer = require("multer");
const fs = require("fs");

const getStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folder}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
};

const uploadFile = (folder) => {
  const storage = getStorage(folder);
  return multer({ storage });
};

module.exports = uploadFile;
