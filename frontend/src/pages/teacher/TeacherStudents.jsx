import TeacherLayout from "../../layouts/TeacherLayout";

function TeacherStudents() {

    return (

        <TeacherLayout>

            <div>

                <h1 className="text-4xl font-bold text-gray-800">
                    Mes étudiants
                </h1>

                <p className="text-gray-500 mt-2">
                    Consultez les étudiants inscrits à vos cours.
                </p>

            </div>

        </TeacherLayout>

    );

}

export default TeacherStudents;