const express = require("express");
const { diskStorage } = require("multer");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
const UPLOAD_FOLDER = "./uploads";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    //creating a nicely formated filename
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLocaleLowerCase()
        .split(" ")
        .join("-") + Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  // dest: UPLOAD_FOLDER,
  storage: storage,
  limits: {
    fileSize: 1000000, //1MB - in bytes
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname == "avatar") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .png .jpg .jpeg formats are allowed"), false);
      }
    } else if (file.fieldname == "vid") {
      if (file.mimetype == "video/mp4") {
        cb(null, true);
      } else {
        cb(new Error("only mp4 allowed"));
      }
    }
  },
});

/**
 * upload.none()    to handle form data
 * upload.single(field_name_on_form)  uploads a single file
 * upload.array(field_name,numberOfMaximumElement) uploads multiple file
 * upload.fields([
 *  {name:field_name_on_form,maxCount:10},
 *  {name:field_name_on_form,maxCount:5}
 * ])
 */
app.post(
  "/",
  upload.fields([
    { name: "vid", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    const pic = req.files.avatar[0];

    res.send(`
    puran nam: ${pic.originalname}
    notun nam: ${pic.filename}
    size: ${pic.size / 1000}kb
  `);
  }
);
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError)
      res
        .status(500)
        .send(`something went wrong at file upload.... ${err.message}`);
    else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("File uploaded successfully!");
  }
});
app.listen(5000, () => {
  console.log("running server 5000");
});
