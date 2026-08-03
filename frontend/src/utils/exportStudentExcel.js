import * as XLSX from "xlsx";
import { toast } from "react-toastify";

// ==========================================
// EXPORT EXCEL
// ==========================================
const exportStudentExcel = (students) => {

    if (!students.length) {

        toast.warning(
    
            "Aucun étudiant à exporter."
    
        );
    
        return;
    
    }

    const data = students.map((student) => ({

        Nom: student.name,

        Email: student.email,

        Cours: student.course,

        Progression: `${student.progress}%`,

        Statut: student.status,

        "Dernière connexion": student.lastLogin

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Etudiants"

    );

    const today = new Date();

    const date = today.toLocaleDateString("fr-FR").replace(/\//g,"-");

    XLSX.writeFile(

        workbook,

        `SALAM_CI_Etudiants_${date}.xlsx`

    );

    toast.success(

        "Le fichier Excel a été exporté avec succès."
    
    );

};

export default exportStudentExcel;