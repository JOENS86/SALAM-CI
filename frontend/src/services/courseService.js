import API from "./api";

// =====================================================
// SERVICE DES COURS
// =====================================================

class CourseService {

    // =====================================================
    // COURS DE L'ENSEIGNANT CONNECTE
    // =====================================================

    async getTeacherCourses() {

        const response = await API.get(

            "/courses/teacher"

        );

        return response.data;

    }

}

export default new CourseService();