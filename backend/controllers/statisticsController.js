import User from "../models/User.js";
import Course from "../models/Course.js";
import Conference from "../models/Conference.js";
import Enrollment from "../models/Enrollment.js";


// =====================================================
// STATISTIQUES GÉNÉRALES DE LA PLATEFORME
// GET /api/statistics
// =====================================================

export const getPlatformStatistics = async (req, res) => {

    try {

        // =====================================================
        // UTILISATEURS
        // =====================================================

        const totalUsers = await User.countDocuments();

        const students = await User.countDocuments({
            role: "student"
        });

        const teachers = await User.countDocuments({
            role: "teacher"
        });

        const admins = await User.countDocuments({
            role: "admin"
        });


        // =====================================================
        // COURS
        // =====================================================

        const totalCourses = await Course.countDocuments();

        const publishedCourses = await Course.countDocuments({
            status: "Publié"
        });

        const pendingCourses = await Course.countDocuments({
            status: "En attente"
        });

        const suspendedCourses = await Course.countDocuments({
            status: "Suspendu"
        });


        // =====================================================
        // CONFÉRENCES
        // =====================================================

        const totalConferences =
            await Conference.countDocuments();


        const liveConferences =
            await Conference.countDocuments({
                status: "live"
            });


        const scheduledConferences =
            await Conference.countDocuments({
                status: "scheduled"
            });


        const completedConferences =
            await Conference.countDocuments({
                status: "completed"
            });


        // =====================================================
        // CERTIFICATS
        // =====================================================

        const totalCertificates =
            await Enrollment.countDocuments({
                certificateIssued: true
            });


        // =====================================================
        // RÉPONSE
        // =====================================================

        res.status(200).json({

            success: true,

            users: {

                total: totalUsers,

                students,

                teachers,

                admins

            },

            courses: {

                total: totalCourses,

                published: publishedCourses,

                pending: pendingCourses,

                suspended: suspendedCourses

            },

            conferences: {

                total: totalConferences,

                live: liveConferences,

                scheduled: scheduledConferences,

                completed: completedConferences

            },

            certificates: {

                total: totalCertificates

            }

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur statistiques plateforme :",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les statistiques.",

            error: error.message

        });

    }

};