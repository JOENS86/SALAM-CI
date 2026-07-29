import multer from "multer";
import fs from "fs";
import path from "path";

// ============================================================
// CREATION DU DOSSIER uploads SI INEXISTANT
// ============================================================

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir);

}

// ============================================================
// CONFIGURATION DU STOCKAGE
// ============================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        const uniqueName =

            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});

// ============================================================
// FILTRE DES TYPES DE FICHIERS
// ============================================================

const fileFilter = (req, file, cb) => {

    // Images
    if (file.mimetype.startsWith("image/")) {

        return cb(null, true);

    }

    // PDF
    if (file.mimetype === "application/pdf") {

        return cb(null, true);

    }

    // Vidéos
    if (file.mimetype.startsWith("video/")) {

        return cb(null, true);

    }

    cb(

        new Error("Type de fichier non autorisé."),

        false

    );

};

// ============================================================
// CONFIGURATION MULTER
// ============================================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 500 * 1024 * 1024 // 500 Mo

    }

});

export default upload;