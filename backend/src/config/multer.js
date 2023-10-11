require('dotenv').config();
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')


const fileServer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.env.SERVER_FILE))
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err)

      const fileName = `${hash.toString(('hex'))}-${file.originalname}`
      cb(null, fileName)
    })
  }
})

module.exports = {
  dest: path.resolve(process.env.SERVER_FILE),
  storage: fileServer,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type!"))
    }
  }
}