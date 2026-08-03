import API from "./api";

// =====================================================
// SERVICE DES INSCRIPTIONS
// =====================================================

class EnrollmentService {

    // =====================================================
    // MES COURS
    // =====================================================

    async getMyCourses() {

        const response = await API.get(

            "/enrollments/my-courses"

        );

        return response.data;

    }

    // =====================================================
    // ETUDIANTS DE L'ENSEIGNANT
    // =====================================================

    async getTeacherStudents() {

        const response = await API.get(

            "/enrollments/teacher/students"

        );

        return response.data;

    }

    // =====================================================
    // DETAILS D'UNE INSCRIPTION
    // =====================================================

    async getEnrollment(id) {

        const response = await API.get(

            `/enrollments/${id}`

        );

        return response.data;

    }

    // =====================================================
    // MISE A JOUR DE LA PROGRESSION
    // =====================================================

    async updateProgress(courseId, progress) {

        const response = await API.patch(

            `/enrollments/${courseId}/progress`,

            {

                progress

            }

        );

        return response.data;

    }

    // =====================================================
    // SE DESINSCRIRE
    // =====================================================

    async unenroll(courseId) {

        const response = await API.delete(

            `/enrollments/${courseId}`

        );

        return response.data;

    }

    // =====================================================
    // VERIFIER INSCRIPTION
    // =====================================================

    async checkEnrollment(courseId) {

        const response = await API.get(

            `/enrollments/check/${courseId}`

        );

        return response.data;

    }

}

export default new EnrollmentService();