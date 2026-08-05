import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// =====================================================
// SERVICE DES INSCRIPTIONS
// =====================================================

class EnrollmentService {

    // =====================================================
    // INSCRIRE UN ETUDIANT
    // =====================================================

    async enrollStudent(student, courseId) {

        // -------------------------
        // Vérifier le cours
        // -------------------------

        const course = await Course.findById(courseId);

        if (!course) {

            throw new Error("Cours introuvable.");

        }

        // -------------------------
        // Vérifier l'inscription
        // -------------------------

        const exists = await Enrollment.findOne({

            student: student._id,

            course: courseId

        });

        if (exists) {

            throw new Error(

                "Vous êtes déjà inscrit à ce cours."

            );

        }

        // -------------------------
        // Création
        // -------------------------

        const enrollment = await Enrollment.create({

            student: student._id,

            course: courseId

        });

        // -------------------------
        // Mise à jour du compteur
        // -------------------------

        course.studentsCount += 1;

        await course.save();

        return {

            success: true,

            message: "Inscription réussie.",

            enrollment

        };

    }

    // =====================================================
    // MES COURS (ETUDIANT)
    // =====================================================

    async getMyCourses(student) {

        const enrollments = await Enrollment.find({

            student: student._id

        })

        .populate({

            path: "course",

            populate: {

                path: "teacher",

                select: "name email"

            }

        })

        .sort({

            createdAt: -1

        });

        return {

            success: true,

            enrollments

        };

    }

// =====================================================
// ETUDIANTS DE L'ENSEIGNANT
// =====================================================

async getTeacherStudents(teacher) {

    const courses = await Course.find({

        teacher: teacher._id

    }).select("_id");

    const courseIds = courses.map(course => course._id);

    const enrollments = await Enrollment.find({

        course: {

            $in: courseIds

        }

    })
    .populate({

        path: "student",

        select: "name email"

    })
    .populate({

        path: "course",

        select: "title"

    })
    .sort({

        createdAt: -1

    });

    return {

        success: true,

        students: enrollments

    };

}

    // =====================================================
    // METTRE A JOUR LA PROGRESSION
    // =====================================================

    async updateProgress(

        student,

        courseId,

        progress

    ) {

        const enrollment = await Enrollment.findOne({

            student: student._id,

            course: courseId

        });

        if (!enrollment) {

            throw new Error(

                "Inscription introuvable."

            );

        }

        enrollment.progress = progress;

        enrollment.lastAccess = new Date();

        if (progress >= 100) {

            enrollment.progress = 100;

            enrollment.completed = true;

            enrollment.status = "completed";

            enrollment.certificateIssued = true;

            enrollment.certificateDate = new Date();

        }

        await enrollment.save();

        return {

            success: true,

            message: "Progression mise à jour.",

            enrollment

        };

    }

// =====================================================
// SE DESINSCRIRE D'UN COURS
// =====================================================

async unenrollStudent(student, courseId) {

    // -------------------------
    // Rechercher l'inscription
    // -------------------------

    const enrollment = await Enrollment.findOne({

        student: student._id,

        course: courseId

    });

    if (!enrollment) {

        throw new Error(

            "Vous n'êtes pas inscrit à ce cours."

        );

    }

    // -------------------------
    // Rechercher le cours
    // -------------------------

    const course = await Course.findById(

        courseId

    );

    // -------------------------
    // Supprimer l'inscription
    // -------------------------

    await enrollment.deleteOne();

    // -------------------------
    // Mettre à jour le compteur
    // -------------------------

    if (

        course &&

        course.studentsCount > 0

    ) {

        course.studentsCount -= 1;

        await course.save();

    }

    return {

        success: true,

        message: "Vous avez quitté le cours."

    };

}

// =====================================================
// VERIFIER SI L'ETUDIANT EST INSCRIT
// =====================================================

async isStudentEnrolled(

    student,

    courseId

) {

    const enrollment = await Enrollment.findOne({

        student: student._id,

        course: courseId

    });

    return {

        success: true,

        enrolled: !!enrollment,

        enrollment

    };

}

// =====================================================
// DETAILS D'UNE INSCRIPTION
// =====================================================

async getEnrollment(id, teacher) {

    const enrollment = await Enrollment.findById(id)

    .populate(
        "student",
        "name email avatar createdAt lastLogin"
    )

    .populate({

        path: "course",

        populate: {

            path: "teacher",

            select: "name email"

        }

    });

    if (!enrollment) {

        throw new Error("Inscription introuvable.");

    }

    // Vérifie que le cours appartient bien à cet enseignant
    if (

        enrollment.course.teacher._id.toString()

        !==

        teacher._id.toString()

    ) {

        throw new Error("Accès refusé.");

    }

    return {

        success: true,

        enrollment

    };

}

}

export default new EnrollmentService();