import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import logo from "../assets/images/Salam-CI.jpg";

import imageToBase64 from "./imageToBase64";
import { toast } from "react-toastify";

// ==========================================
// EXPORT PDF
// ==========================================
const exportStudentPDF = async (

    students,

    user

) => {

    if (!students.length) {

        toast.warning(
    
            "Aucun étudiant à exporter."
    
        );
    
        return;
    
    }

    const logoBase64 = await imageToBase64(

        logo

    );

    const doc = new jsPDF();

    const today = new Date();

    const date = today.toLocaleDateString("fr-FR");

    const heure = today.toLocaleTimeString("fr-FR");

    // ==========================================
    // HEADER
    // ==========================================

    doc.setFillColor(

        124,

        58,

        237

    );

    doc.rect(

        0,

        0,

        210,

        35,

        "F"

    );

    doc.addImage(

        logoBase64,

        "JPEG",

        15,

        6,

        22,

        22

    );

    doc.setTextColor(

        255,

        255,

        255

    );

    doc.setFontSize(24);

    doc.text(

        "SALAM CI",

        105,

        16,

        {

            align:"center"

        }

    );

    doc.setFontSize(11);

    doc.text(

        "Plateforme d'E-learning Intelligente",

        105,

        24,

        {

            align:"center"

        }

    );

    // ==========================================
    // INFORMATIONS
    // ==========================================

    doc.setTextColor(0,0,0);

    doc.setFontSize(18);

    doc.text(

        "Liste des étudiants",

        15,

        48

    );

    doc.setFontSize(11);

    doc.text(

        `Enseignant : ${user.firstName} ${user.lastName}`,

        15,

        60

    );

    doc.text(

        `Date : ${date}`,

        15,

        68

    );

    doc.text(

        `Heure : ${heure}`,

        15,

        76

    );

    doc.text(

        `Nombre total d'étudiants : ${students.length}`,

        15,

        84

    );

    // ==========================================
    // TABLEAU
    // ==========================================

    autoTable(doc, {

        startY:95,

        head:[[
            "Nom",
            "Email",
            "Cours",
            "Progression",
            "Statut"
        ]],

        body: students.map(student => [

            student.name,

            student.email,

            student.course,

            `${student.progress}%`,

            student.status

        ]),

        headStyles:{

            fillColor:[124,58,237],

            textColor:[255,255,255]

        },

        alternateRowStyles:{

            fillColor:[248,245,255]

        },

        styles:{

            fontSize:10,

            cellPadding:3

        },

        didDrawPage:(data)=>{

            const pageCount =

            doc.internal.getNumberOfPages();

            doc.setFontSize(10);

            doc.setTextColor(120);

            doc.text(

                `Page ${data.pageNumber}/${pageCount}`,

                15,

                290

            );

            doc.text(

                "Généré automatiquement par SALAM CI",

                195,

                290,

                {

                    align:"right"

                }

            );

        }

    });

    doc.save(

        `SALAM_CI_Etudiants_${date.replace(/\//g,"-")}.pdf`

    );

    toast.success(

        "Le fichier PDF a été exporté avec succès."
    
    );

};

export default exportStudentPDF;