const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

require('dotenv').config();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
    // TODO
    // upload the file to tmp and then save to google storage and work properly with image url in google storage
    //https://stackoverflow.com/questions/36661795/how-to-upload-an-image-to-google-cloud-storage-from-an-image-url-in-node
    //https://github.com/googleapis/google-cloud-node#google-cloud-storage
    //https://github.com/googleapis/nodejs-storage
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

const uploadHandler = multer({
  storage: multerGoogleStorage.storageEngine({
    acl: "publicread"
  })
});

//module.exports = multer({ storage: storage }).single("image");
module.exports = uploadHandler.single("image");
