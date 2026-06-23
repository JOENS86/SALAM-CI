import {
    FaClock,
    FaStar,
    FaUserGraduate
  } from "react-icons/fa"
  
  function CourseCard({ course }) {
  
    return (
  
      <div
        className="
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-300
        "
      >
  
        {/* IMAGE */}
  
        <div className="relative">
  
          <img
            src={course.image}
            alt={course.title}
            className="
            w-full
            h-56
            object-cover
            "
          />
  
          <span
            className="
            absolute
            top-4
            left-4
            bg-purple-600
            text-white
            text-xs
            px-3
            py-1
            rounded-full
            "
          >
            {course.category}
          </span>
  
        </div>
  
        {/* CONTENU */}
  
        <div className="p-6">
  
          <h2
            className="
            text-xl
            font-bold
            mb-3
            "
          >
            {course.title}
          </h2>
  
          <p className="text-gray-500 mb-4">
  
            {course.description}
  
          </p>
  
          {/* PROF */}
  
          <div
            className="
            flex
            items-center
            gap-3
            mb-4
            "
          >
  
            <FaUserGraduate className="text-purple-600" />
  
            <span className="text-sm">
  
              {course.teacher}
  
            </span>
  
          </div>
  
          {/* INFOS */}
  
          <div
            className="
            flex
            justify-between
            text-gray-500
            text-sm
            mb-5
            "
          >
  
            <span>
  
              {course.level}
  
            </span>
  
            <span
              className="
              flex
              items-center
              gap-2
              "
            >
              <FaClock />
  
              {course.duration}
            </span>
  
          </div>
  
          {/* NOTE */}
  
          <div
            className="
            flex
            items-center
            gap-2
            mb-5
            "
          >
  
            <FaStar className="text-yellow-400" />
  
            <span>
  
              {course.rating}
  
            </span>
  
          </div>
  
          {/* BOUTON */}
  
          <button
            className="
            w-full
            bg-gradient-to-r
            from-purple-600
            to-indigo-600
            text-white
            py-3
            rounded-xl
            hover:scale-105
            transition-all
            "
          >
            Voir le cours
          </button>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default CourseCard