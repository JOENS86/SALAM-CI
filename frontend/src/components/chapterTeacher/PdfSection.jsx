// ============================================================
// IMPORTS
// ============================================================
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {

    FaFilePdf,
    FaPlus,
    FaDownload,
    FaEdit,
    FaTrash

} from "react-icons/fa";

import AddPdfModal from "./AddPdfModal";
import axios from "axios";

// ============================================================
// COMPONENT
// ============================================================
function PdfSection({ chapterId }) {

    // ========================================================
    // MODAL
    // ========================================================

    const [showModal, setShowModal] = useState(false);

    // ========================================================
    // DELETE MODAL
    // ========================================================
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pdfToDelete, setPdfToDelete] = useState(null);

    // ========================================================
    // LISTE DES PDF
    // ========================================================

    const [pdfs, setPdfs] = useState([]);

    // ========================================================
    // PDF SELECTIONNE
    // ========================================================
    const [selectedPdf, setSelectedPdf] = useState(null);

// ========================================================
// RECUPERER LES PDF
// ========================================================

const fetchPdfs = async () => {

    try {

        const res = await axios.get(

            `http://localhost:5000/api/pdfs/chapter/${chapterId}`

        );

        setPdfs(res.data);

    }

    catch (error) {

            console.error(error);
        
            toast.error("Impossible de charger les documents.");
          

    }

};

useEffect(() => {

    if (chapterId) {

        fetchPdfs();

    }

}, [chapterId]);

// ========================================================
// SUPPRIMER UN PDF
// ========================================================

const deletePdf = async (id) => {

    try {

        await axios.delete(
            `http://localhost:5000/api/pdfs/${id}`
        );

        toast.success("Document supprimé avec succès.");

        setShowDeleteModal(false);
        setPdfToDelete(null);

        fetchPdfs();

    }

    catch (error) {

        console.log(error);

        toast.error("Impossible de supprimer le document.");

    }

};

// ========================================================
// TELECHARGER UN PDF
// ========================================================
const downloadPdf = (pdf) => {

    if (!pdf.file) {

        toast.warning("Aucun document disponible.");

        return;

    }

    const link = document.createElement("a");

    link.href = `http://localhost:5000/${pdf.file}`;

    link.download = pdf.title + ".pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

};


    return (

        <div className="bg-white rounded-3xl shadow-md p-8 mt-10">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaFilePdf className="text-red-600"/>

                        Documents PDF

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Tous les supports du chapitre.

                    </p>

                </div>

                <button

                    onClick={() => setShowModal(true)}

                    className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        flex
                        items-center
                        gap-3
                    "

                >

                    <FaPlus/>

                    Ajouter un PDF

                </button>

            </div>

            {/* LISTE */}

            {

                pdfs.length === 0 ?

                (

                    <div className="text-center py-16">

                        <FaFilePdf

                            className="mx-auto text-6xl text-red-200"

                        />

                        <h3 className="mt-6 text-2xl font-bold">

                            Aucun document

                        </h3>

                        <p className="text-gray-500 mt-3">

                            Ajoutez votre premier document PDF.

                        </p>

                    </div>

                )

                :

                (

                    <div className="space-y-5 mt-8">

                        {

                            pdfs.map((pdf)=>(

<div

key={pdf._id}

className="
    border
    rounded-2xl
    p-6
    flex
    justify-between
    items-center
"

>

<div>

    <h3 className="text-xl font-bold">

        {pdf.title}

    </h3>

    <p className="text-gray-500 mt-2">

        {pdf.description}

    </p>

</div>

<div className="flex gap-3">

<button
    title="Télécharger"
    onClick={() => downloadPdf(pdf)}
    className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        p-3
        rounded-xl "
>
    <FaDownload/>
</button>

    <button
        onClick={() => {
          setSelectedPdf(pdf);
          setShowModal(true);
        }}
        className="
            bg-green-600
            hover:bg-green-700
            text-white
            p-3
            rounded-xl
        "

    >

        <FaEdit/>

    </button>

    <button
        onClick={() => {
          setPdfToDelete(pdf);
          setShowDeleteModal(true);
        }}
        className="
            bg-red-600
            hover:bg-red-700
            text-white
            p-3
            rounded-xl "
    >

        <FaTrash/>

    </button>

</div>

</div>

                            ))

                        }

                    </div>

                )

            }


{/* =========================
    MODAL SUPPRESSION
========================= */}

{
  showDeleteModal && pdfToDelete && (
    <div className=" fixed inset-0 bg-black/60 flex justify-center items-center z-50 ">
      <div className=" bg-white rounded-3xl w-[520px] shadow-2xl p-8 ">

          <div className=" flex justify-center mb-6 ">
            <div className=" w-20 h-20 rounded-full bg-red-100 flex items-center justify-center ">

        <FaTrash
          className=" text-red-600 text-3xl "
        />
            
            </div>
          </div>

          <h2 className=" text-3xl font-bold text-center ">
              Supprimer le fichier PDF ?
          </h2>

          <p className=" text-gray-500 text-center mt-5 leading-8 ">
              Vous êtes sur le point de supprimer définitivement ce fichier.
                <br/>
              Cette action est irréversible.
          </p>

              <div className=" bg-gray-100 rounded-2xl mt-8 p-5 ">

                <h3 className=" font-bold text-xl ">
                  {pdfToDelete.title}
                </h3>
                <p className=" text-gray-500 mt-2 ">
                  {pdfToDelete.description}
                </p>

             </div>

            <div className=" flex justify-end gap-4 mt-10 ">
               
               <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPdfToDelete(null);
                  }}
                  className=" px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 ">
                  Annuler
                </button>

                <button
                  onClick={() => 
                    deletePdf(pdfToDelete._id)
                  }
                  className=" px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white ">
                  Supprimer
                </button>

            </div>

      </div>
    </div>
  )
}

            {/* ================================================= */}
            {/* MODAL */}
            {/* ================================================= */}

<AddPdfModal
    isOpen={showModal}
    onClose={() => {
        setShowModal(false);
        setSelectedPdf(null);
    }}

    chapterId={chapterId}
    pdf={selectedPdf}
    onPdfCreated={fetchPdfs}

/>

        </div>

    );

}

export default PdfSection;