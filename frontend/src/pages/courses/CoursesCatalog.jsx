import CoursesHero from "../../components/courses/CoursesHero"
import CoursesFilters from "../../components/courses/CoursesFilters"
import CoursesGrid from "../../components/courses/CoursesGrid"

function CoursesCatalog() {

  return (

    <div className="min-h-screen bg-gray-50">

      {/* HERO */}

      <CoursesHero />

      {/* CONTENU */}

      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-10">

        <CoursesFilters />

        <div className="mt-8">

          <CoursesGrid />

        </div>

      </div>

    </div>

  )

}

export default CoursesCatalog