import {
    FaCalendarAlt,
    FaClock,
    FaImage,
    FaLink,
    FaUsers,
    FaBook,
    FaHeading,
    FaAlignLeft
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { successToast, errorToast } from "../../utils/toast";

import courseService from "../../services/courseService";
import conferenceService from "../../services/conferenceService";

function ConferenceForm() {

    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        image: "",

        title: "",

        description: "",

        course: "",

        date: "",

        time: "",

        duration: 60,

        maxParticipants: 100,

        meetingLink: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

// =====================================================
// CHARGER LES COURS
// =====================================================
useEffect(() => {

    loadCourses();

}, []);

const loadCourses = async () => {

    try {

        const data = await courseService.getTeacherCourses();

        setCourses(data.courses);

    }

    catch (error) {

        console.log(error);

        errorToast(

            "Erreur",

            "Impossible de charger vos cours."

        );

    }

};

// =====================================================
// ENVOYER LA DEMANDE
// =====================================================

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        const result = await conferenceService.createRequest(

            formData

        );

        successToast(

            "Succès",

            result.message

        );

        navigate("/teacher-conferences");

    }

    catch (error) {

        console.error(error);

        errorToast(

            "Erreur",

            error.response?.data?.message ||

            "Impossible d'envoyer la demande."

        );

    }

    finally {

        setLoading(false);

    }

};


    return (

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
            {/* ========================= */}
            {/* TITRE */}
            {/* ========================= */}

            <div>

                <h1 className="text-4xl font-bold">

                    Nouvelle conférence

                </h1>

                <p className="text-gray-500 mt-2">

                    Envoyez une demande de conférence à l'administrateur.

                </p>

            </div>

            {/* ========================= */}
            {/* INFORMATIONS */}
            {/* ========================= */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Informations générales

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <label className="font-semibold flex items-center gap-2 mb-2">

                            <FaHeading />

                            Titre

                        </label>

                        <input

                            type="text"

                            name="title"

                            value={formData.title}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                    <div>

                        <label className="font-semibold flex items-center gap-2 mb-2">

                            <FaBook />

                            Cours

                        </label>

                        <select

                            name="course"

                            value={formData.course}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        >

                           <option value="">

                               Sélectionner un cours

                           </option>

                           {
                        courses.map((course) => (

                            <option
                              key={course._id}
                              value={course._id}
                            >
                              {course.title}

                           </option>

                        ))
                          }

                        </select>

                    </div>

                </div>

                <div className="mt-6">

                    <label className="font-semibold flex items-center gap-2 mb-2">

                        <FaAlignLeft />

                        Description

                    </label>

                    <textarea

                        rows="5"

                        name="description"

                        value={formData.description}

                        onChange={handleChange}

                        className="w-full border rounded-xl p-3"

                    />

                </div>

                <div className="mt-6">

                    <label className="font-semibold flex items-center gap-2 mb-2">

                        <FaImage />

                        Image de couverture

                    </label>

                    <input

                        type="file"

                        className="w-full"

                    />

                </div>

            </div>

            {/* ========================= */}
            {/* PLANIFICATION */}
            {/* ========================= */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Planification

                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div>

                        <label className="font-semibold flex items-center gap-2 mb-2">

                            <FaCalendarAlt />

                            Date

                        </label>

                        <input

                            type="date"

                            name="date"

                            value={formData.date}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                    <div>

                        <label className="font-semibold flex items-center gap-2 mb-2">

                            <FaClock />

                            Heure

                        </label>

                        <input

                            type="time"

                            name="time"

                            value={formData.time}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                    <div>

                        <label className="font-semibold mb-2 block">

                            Durée (minutes)

                        </label>

                        <input

                            type="number"

                            name="duration"

                            value={formData.duration}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                </div>

            </div>

            {/* ========================= */}
            {/* PARTICIPANTS */}
            {/* ========================= */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Participants

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <label className="font-semibold flex items-center gap-2 mb-2">

                            <FaUsers />

                            Nombre maximum

                        </label>

                        <input

                            type="number"

                            name="maxParticipants"

                            value={formData.maxParticipants}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                    <div>

                        <label className="font-semibold flex items-center gap-2 mb-2">

                            <FaLink />

                            Lien Meet / Zoom (optionnel)

                        </label>

                        <input

                            type="text"

                            name="meetingLink"

                            value={formData.meetingLink}

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                </div>

            </div>

            {/* ========================= */}
            {/* ACTIONS */}
            {/* ========================= */}

            <div className="flex justify-end gap-4">

                <button

                  type="button"

                  onClick={() => navigate("/teacher-conferences")}

                  className="px-8 py-3 rounded-xl border"

                >

                    Annuler

                </button>

                <button type="submit" disabled={loading} className=" bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 " >

                   {
                      loading
                      ?
                        "Envoi..."
                        :
                        "Envoyer la demande"
                   }
                </button>

            </div>

        </form>

    );

}

export default ConferenceForm;