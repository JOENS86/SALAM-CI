import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

import {
  FaFilePdf,
  FaFileVideo,
  FaFileAlt,
  FaImage,
  FaDownload,
  FaEye,
  FaTrash,
  FaSearch,
  FaFolderOpen,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://salam-ci-backend.onrender.com";

function Files() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  // ==========================================
  // CHARGER LES FICHIERS
  // ==========================================

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/files`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Impossible de récupérer les fichiers"
        );
      }

      console.log("📁 Fichiers récupérés :", data.files);

      setFiles(data.files || []);
    } catch (err) {
      console.error("❌ Erreur fichiers :", err);

      setError(
        "Impossible de charger les fichiers. Vérifiez la connexion au serveur."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTRAGE
  // ==========================================

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return files.filter((file) => {
      const matchesSearch =
        !query ||
        [
          file.name,
          file.type,
          file.owner,
          file.source,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

      const matchesType =
        typeFilter === "Tous" ||
        file.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [files, search, typeFilter]);

  // ==========================================
  // STATISTIQUES
  // ==========================================

  const stats = useMemo(() => {
    return {
      total: files.length,

      images: files.filter(
        (file) => file.type === "Image"
      ).length,

      pdfs: files.filter(
        (file) => file.type === "PDF"
      ).length,

      videos: files.filter(
        (file) => file.type === "Vidéo"
      ).length,
    };
  }, [files]);

  // ==========================================
  // ICÔNES
  // ==========================================

  const getIcon = (type) => {
    switch (type) {
      case "PDF":
        return (
          <FaFilePdf className="text-red-500" />
        );

      case "Vidéo":
        return (
          <FaFileVideo className="text-blue-500" />
        );

      case "Image":
        return (
          <FaImage className="text-green-500" />
        );

      default:
        return (
          <FaFileAlt className="text-gray-500" />
        );
    }
  };

  const getIconBackground = (type) => {
    switch (type) {
      case "PDF":
        return "bg-red-50";

      case "Vidéo":
        return "bg-blue-50";

      case "Image":
        return "bg-green-50";

      default:
        return "bg-gray-50";
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // APERÇU
  // ==========================================

  const openPreview = (file) => {
    if (!file.url) return;

    setPreview(file);
  };

  // ==========================================
  // TÉLÉCHARGEMENT
  // ==========================================

  const downloadFile = (file) => {
    if (!file.url) return;

    const link = document.createElement("a");

    link.href = file.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = file.name || "fichier";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <AdminLayout>

      {/* ======================================
          EN-TÊTE
      ====================================== */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3 mb-2">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FaFolderOpen className="text-xl" />
              </div>

              <h1 className="text-4xl font-bold text-gray-900">
                Gestion des Fichiers
              </h1>

            </div>

            <p className="text-gray-500">
              Consultez et gérez les fichiers
              réellement présents sur la plateforme.
            </p>

          </div>

          <button
            onClick={fetchFiles}
            className="
              px-5
              py-3
              rounded-xl
              bg-purple-600
              hover:bg-purple-700
              text-white
              font-semibold
              transition
              shadow-sm
            "
          >
            Actualiser
          </button>

        </div>

      </div>

      {/* ======================================
          STATISTIQUES
      ====================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
          mb-8
        "
      >

        {/* TOTAL */}

        <div
          className="
            bg-white
            rounded-2xl
            p-5
            shadow-sm
            border
            border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Total des fichiers
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.total}
          </p>

        </div>

        {/* IMAGES */}

        <div
          className="
            bg-white
            rounded-2xl
            p-5
            shadow-sm
            border
            border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Images
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.images}
          </p>

        </div>

        {/* PDF */}

        <div
          className="
            bg-white
            rounded-2xl
            p-5
            shadow-sm
            border
            border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            PDF
          </p>

          <p className="text-3xl font-bold text-red-500 mt-2">
            {stats.pdfs}
          </p>

        </div>

        {/* VIDEOS */}

        <div
          className="
            bg-white
            rounded-2xl
            p-5
            shadow-sm
            border
            border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Vidéos
          </p>

          <p className="text-3xl font-bold text-blue-500 mt-2">
            {stats.videos}
          </p>

        </div>

      </div>

      {/* ======================================
          RECHERCHE + FILTRE
      ====================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-gray-100
          p-4
          mb-6
        "
      >

        <div className="flex flex-col lg:flex-row gap-4">

          {/* RECHERCHE */}

          <div
            className="
              flex
              items-center
              gap-3
              flex-1
              border
              border-gray-200
              rounded-xl
              px-4
              py-3
              focus-within:border-purple-500
              transition
            "
          >

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Rechercher par nom, auteur ou type..."
              className="
                flex-1
                outline-none
                text-gray-700
              "
            />

          </div>

          {/* FILTRE */}

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="
              lg:w-48
              border
              border-gray-200
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              bg-white
            "
          >

            <option value="Tous">
              Tous les types
            </option>

            <option value="Image">
              Images
            </option>

            <option value="PDF">
              PDF
            </option>

            <option value="Vidéo">
              Vidéos
            </option>

          </select>

        </div>

      </div>

      {/* ======================================
          TABLEAU
      ====================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-gray-100
          overflow-hidden
        "
      >

        {/* CHARGEMENT */}

        {loading && (

          <div className="p-12 text-center text-gray-500">

            Chargement des fichiers...

          </div>

        )}

        {/* ERREUR */}

        {!loading && error && (

          <div className="p-10 text-center">

            <p className="text-red-500 mb-4">
              {error}
            </p>

            <button
              onClick={fetchFiles}
              className="
                px-5
                py-2
                rounded-xl
                bg-purple-600
                text-white
              "
            >
              Réessayer
            </button>

          </div>

        )}

        {/* AUCUN FICHIER */}

        {!loading &&
          !error &&
          filteredFiles.length === 0 && (

            <div className="p-14 text-center">

              <FaFolderOpen
                className="
                  mx-auto
                  text-5xl
                  text-gray-300
                  mb-4
                "
              />

              <h2 className="text-xl font-bold text-gray-700">
                Aucun fichier trouvé
              </h2>

              <p className="text-gray-400 mt-2">
                Aucun fichier ne correspond à votre recherche.
              </p>

            </div>

          )}

        {/* TABLE */}

        {!loading &&
          !error &&
          filteredFiles.length > 0 && (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead
                  className="
                    bg-gray-50
                    border-b
                    border-gray-100
                  "
                >

                  <tr>

                    <th className="text-left p-5 font-semibold text-gray-600">
                      Fichier
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-600">
                      Type
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-600">
                      Auteur
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-600">
                      Source
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-600">
                      Ajouté le
                    </th>

                    <th className="text-right p-5 font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredFiles.map((file) => (

                    <tr
                      key={file._id}
                      className="
                        border-b
                        last:border-b-0
                        hover:bg-gray-50/70
                        transition
                      "
                    >

                      {/* FICHIER */}

                      <td className="p-5">

                        <div className="flex items-center gap-4">

                          {/* MINIATURE */}

                          {file.type === "Image" &&
                          file.url ? (

                            <img
                              src={file.url}
                              alt={file.name}
                              className="
                                w-14
                                h-14
                                rounded-xl
                                object-cover
                                border
                                border-gray-100
                              "
                            />

                          ) : (

                            <div
                              className={`
                                w-14
                                h-14
                                rounded-xl
                                ${getIconBackground(file.type)}
                                flex
                                items-center
                                justify-center
                                text-xl
                              `}
                            >
                              {getIcon(file.type)}
                            </div>

                          )}

                          <div className="min-w-0">

                            <p
                              className="
                                font-bold
                                text-gray-800
                                truncate
                                max-w-[280px]
                              "
                            >
                              {file.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">

                              {file.size &&
                              file.size !== "—"
                                ? file.size
                                : "Taille non disponible"}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* TYPE */}

                      <td className="p-5">

                        <span
                          className="
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            bg-gray-100
                            text-gray-700
                          "
                        >
                          {file.type}
                        </span>

                      </td>

                      {/* AUTEUR */}

                      <td className="p-5">

                        <span className="text-gray-700 font-medium">
                          {file.owner || "—"}
                        </span>

                      </td>

                      {/* SOURCE */}

                      <td className="p-5">

                        <span
                          className="
                            text-sm
                            text-gray-500
                            capitalize
                          "
                        >
                          {file.source || "—"}
                        </span>

                      </td>

                      {/* DATE */}

                      <td className="p-5 text-sm text-gray-500">

                        {formatDate(file.createdAt)}

                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">

                        <div className="flex justify-end gap-2">

                          {/* VOIR */}

                          <button
                            onClick={() =>
                              openPreview(file)
                            }
                            disabled={!file.url}
                            title="Voir"
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-blue-50
                              text-blue-600
                              hover:bg-blue-100
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                              flex
                              items-center
                              justify-center
                              transition
                            "
                          >
                            <FaEye />
                          </button>

                          {/* TELECHARGER */}

                          <button
                            onClick={() =>
                              downloadFile(file)
                            }
                            disabled={!file.url}
                            title="Télécharger"
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-green-50
                              text-green-600
                              hover:bg-green-100
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                              flex
                              items-center
                              justify-center
                              transition
                            "
                          >
                            <FaDownload />
                          </button>

                          {/* SUPPRIMER */}

                          <button
                            disabled
                            title="Suppression bientôt disponible"
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-red-50
                              text-red-400
                              opacity-50
                              cursor-not-allowed
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

      </div>

      {/* ======================================
          COMPTEUR
      ====================================== */}

      {!loading && !error && (

        <div className="mt-4 text-sm text-gray-500">

          {filteredFiles.length} fichier
          {filteredFiles.length > 1 ? "s" : ""}
          {" "}affiché
          {filteredFiles.length > 1 ? "s" : ""}

        </div>

      )}

      {/* ======================================
          MODALE APERÇU
      ====================================== */}

      {preview && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/70
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setPreview(null)}
        >

          <div
            className="
              bg-white
              rounded-3xl
              max-w-5xl
              w-full
              max-h-[90vh]
              overflow-hidden
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                p-5
                border-b
              "
            >

              <div>

                <h2 className="font-bold text-lg text-gray-900">
                  {preview.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {preview.type} · {preview.owner}
                </p>

              </div>

              <div className="flex items-center gap-2">

                {/* NOUVEL ONGLET */}

                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                  "
                  title="Ouvrir dans un nouvel onglet"
                >
                  <FaExternalLinkAlt />
                </a>

                {/* FERMER */}

                <button
                  onClick={() =>
                    setPreview(null)
                  }
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-gray-100
                    text-gray-600
                    flex
                    items-center
                    justify-center
                  "
                  title="Fermer"
                >
                  <FaTimes />
                </button>

              </div>

            </div>

            {/* CONTENU APERÇU */}

            <div
              className="
                p-5
                bg-gray-50
                flex
                items-center
                justify-center
                max-h-[75vh]
                overflow-auto
              "
            >

              {/* IMAGE */}

              {preview.type === "Image" && (

                <img
                  src={preview.url}
                  alt={preview.name}
                  className="
                    max-w-full
                    max-h-[68vh]
                    object-contain
                    rounded-xl
                  "
                />

              )}

              {/* VIDEO */}

              {preview.type === "Vidéo" && (

                <video
                  src={preview.url}
                  controls
                  className="
                    max-w-full
                    max-h-[68vh]
                    rounded-xl
                  "
                />

              )}

              {/* PDF */}

              {preview.type === "PDF" && (

                <iframe
                  src={preview.url}
                  title={preview.name}
                  className="
                    w-full
                    h-[68vh]
                    rounded-xl
                    bg-white
                  "
                />

              )}

            </div>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}

export default Files;