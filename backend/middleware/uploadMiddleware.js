import multer from "multer"

// =========================
// CONFIG STORAGE
// =========================
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/")

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    )

  }

})

// =========================
// MULTER
// =========================
const upload = multer({
  storage
})

export default upload