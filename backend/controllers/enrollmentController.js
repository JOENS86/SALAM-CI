import enrollmentService from "../services/enrollmentService.js";

// =====================================================
// INSCRIRE UN ETUDIANT
// =====================================================

export const enrollStudent = async (req, res) => {

    try {

        const result = await enrollmentService.enrollStudent(

            req.user,

            req.body.courseId

        );

        res.status(201).json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// MES COURS
// =====================================================

export const getMyCourses = async (req, res) => {

    try {

        const result = await enrollmentService.getMyCourses(

            req.user

        );

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// SE DESINSCRIRE D'UN COURS
// =====================================================
export const unenrollStudent = async (req, res) => {

    try {

        const result = await enrollmentService.unenrollStudent(

            req.user,

            req.params.courseId

        );

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// VERIFICATION DE L'ETUDIANT
// =====================================================
export const checkEnrollment = async (req, res) => {

    try {

        const result = await enrollmentService.isStudentEnrolled(

            req.user,

            req.params.courseId

        );

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// ETUDIANTS DE L'ENSEIGNANT
// =====================================================

export const getTeacherStudents = async (req, res) => {

    try {

        const result = await enrollmentService.getTeacherStudents(

            req.user

        );

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// METTRE A JOUR LA PROGRESSION
// =====================================================

export const updateProgress = async (req, res) => {

    try {

        const result = await enrollmentService.updateProgress(

            req.user,

            req.params.courseId,

            req.body.progress

        );

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================================
// DETAILS D'UNE INSCRIPTION
// =====================================================

export const getEnrollment = async (req, res) => {

    try {

        const result = await enrollmentService.getEnrollment(

            req.params.id,
        
            req.user
        
        );

        res.json(result);

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};