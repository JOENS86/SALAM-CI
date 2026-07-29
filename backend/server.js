import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

// =========================
// IMPORT ROUTES
// =========================
import authRoutes from "./routes/authRoutes.js"
//import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import conferenceRoutes from "./routes/conferenceRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
//Côté enseignant
import chapterRoutes from "./routes/chapterRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";

// =========================
// CONFIGURATION .ENV
// =========================
dotenv.config()

// =========================
// INITIALISATION EXPRESS
// =========================
const app = express()

// =========================
// MIDDLEWARES
// =========================

// Autorise les requêtes frontend
app.use(cors())

// Permet de lire le JSON
app.use(express.json())

// =========================
// DOSSIER STATIQUE UPLOADS
// =========================
// Permet d'accéder aux fichiers uploadés
// Exemple :
// http://localhost:5000/uploads/image.png
app.use(
  "/uploads",
  express.static("uploads")
)

// =========================
// ROUTES API
// =========================

// AUTH
app.use("/api/auth", authRoutes)

// Tableau de bord
//app.use("/api/dashboard", dashboardRoutes);

// USERS
app.use("/api/users", userRoutes)

// COURSES
app.use("/api/courses", courseRoutes)

// Conférences
app.use("/api/conferences", conferenceRoutes)

// Catégories
app.use("/api/categories", categoryRoutes)

//Chapitres
app.use("/api/chapters", chapterRoutes);

app.use("/api/videos",videoRoutes);

// =========================
// PDF
// =========================
app.use(

  "/api/pdfs",

  pdfRoutes

);

// =========================
// Quiz
// =========================
app.use("/api/quizzes", quizRoutes);

// Exercise
app.use("/api/exercises", exerciseRoutes);

// =========================
// ROUTE TEST API
// =========================
app.get("/", (req, res) => {

  res.send("API SALAM CI")

})

// =========================
// CONNEXION MONGODB
// =========================
mongoose.connect(

  process.env.MONGO_URI,

  {
    serverSelectionTimeoutMS: 5000,

   /* 
      ssl: true,
      tlsAllowInvalidCertificates: true
   */

  }

)

.then(() => {

  console.log("✅ MongoDB connecté")

})

.catch((err) => {

  console.log("❌ Erreur MongoDB")

  // Affiche seulement le message erreur
  console.log(err.message)

})

// =========================
// PORT SERVEUR
// =========================
const PORT = process.env.PORT || 5000

// =========================
// LANCEMENT SERVEUR
// =========================
app.listen(PORT, () => {

  console.log(`🚀 Serveur lancé sur ${PORT}`)

})