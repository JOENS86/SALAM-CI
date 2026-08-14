import ConferenceRequest from "../models/ConferenceRequest.js";
import Conference from "../models/Conference.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import ConferenceParticipant from "../models/ConferenceParticipant.js";
import meetingService from "./meetingService.js";
import notificationService from "./notificationService.js";
import emailService from "./emailService.js";
import Enrollment from "../models/Enrollment.js";
import { getIO } from "../socket/socketManager.js";

class ConferenceService {

// =====================================================
// CREER UNE DEMANDE DE CONFERENCE
// =====================================================
async createRequest(teacher, data) {

    const {

        course,
        title,
        description,
        image,
        date,
        time,
        duration,
        maxParticipants

    } = data;

    // ==========================================
    // VERIFIER LE ROLE
    // ==========================================
    if (teacher.role !== "teacher") {

        throw new Error(
            "Seuls les enseignants peuvent créer une conférence."
        );

    }

    // ==========================================
    // VERIFIER SI LE COURS EXISTE
    // ==========================================
    const courseExists = await Course.findById(course);

    if (!courseExists) {

        throw new Error("Cours introuvable.");

    }

    // ==========================================
    // LE COURS DOIT ETRE PUBLIE
    // ==========================================
    if (courseExists.status !== "Publié") {

        throw new Error(
            "Le cours doit être publié avant de programmer une conférence."
        );

    }

    // ==========================================
    // VERIFIER LE PROPRIETAIRE DU COURS
    // ==========================================
    if (courseExists.teacher.toString() !== teacher._id.toString()) {

        throw new Error(
            "Vous ne pouvez créer une conférence que pour vos propres cours."
        );

    }

    // ==========================================
    // EVITER LES DOUBLONS
    // ==========================================
    const existingRequest = await ConferenceRequest.findOne({

        course,
        date,
        time,
        status: "pending"

    });

    if (existingRequest) {

        throw new Error(
            "Une demande existe déjà pour cette date."
        );

    }

    // ==========================================
    // CREATION DE LA DEMANDE
    // ==========================================
    const request = await ConferenceRequest.create({

        teacher: teacher._id,
        course,
        title,
        description,
        image,
        date,
        time,
        duration,
        maxParticipants,
        status: "pending"

    });

    // ==========================================
    // RECUPERER LES ADMINS
    // ==========================================
    const admins = await User.find({

        role: "admin"

    });

    // ==========================================
    // NOTIFICATIONS + EMAILS
    // Une erreur ici ne doit jamais empêcher
    // la création de la demande.
    // ==========================================
    for (const admin of admins) {

        // Notification
        try {

            await notificationService.create({

                recipient: admin._id,

                sender: teacher._id,

                title: "Nouvelle demande de conférence",

                message: `${teacher.name} souhaite organiser la conférence "${title}".`,

                type: "conference_request",

                entityType: "conferenceRequest",

                entityId: request._id

            });

        }

        catch (error) {

            console.error("Erreur notification :", error.message);

        }

        // Email
        try {

            await emailService.sendConferenceRequestToAdmin(

                admin,

                teacher,

                request

            );

        }

        catch (error) {

            console.error("Erreur email :", error.message);

        }

    }

    // ==========================================
    // REPONSE
    // ==========================================
    return {

        success: true,

        message: "Votre demande de conférence a été envoyée à l'administrateur.",

        request

    };

}

// =====================================================
// CREER DIRECTEMENT UNE CONFERENCE - ADMIN
// =====================================================
async createConference(admin, data) {

    // ==========================================
    // VERIFIER LE ROLE
    // ==========================================
    if (admin.role !== "admin") {

        throw new Error(
            "Seuls les administrateurs peuvent créer directement une conférence."
        );

    }

    const {

        title,
        description,
        image,
        date,
        time,
        duration,
        maxParticipants

    } = data;

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!title) {

        throw new Error(
            "Le titre de la conférence est obligatoire."
        );

    }

    if (!date) {

        throw new Error(
            "La date de la conférence est obligatoire."
        );

    }

    if (!time) {

        throw new Error(
            "L'heure de la conférence est obligatoire."
        );

    }

    // ==========================================
    // VERIFIER LA DATE
    // ==========================================
    const selectedDate = new Date(date);

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    selectedDate.setHours(
        0,
        0,
        0,
        0
    );

    if (selectedDate < today) {

        throw new Error(
            "La date de la conférence ne peut pas être antérieure à aujourd'hui."
        );

    }

    // ==========================================
    // EVITER LES DOUBLONS
    // ==========================================
    const existingConference =
        await Conference.findOne({

            date: selectedDate,

            time,

            status: {
                $ne: "cancelled"
            }

        });

    if (existingConference) {

        throw new Error(
            "Une conférence est déjà programmée à cette date et cette heure."
        );

    }

    // ==========================================
    // GENERER LA SALLE
    // ==========================================
    const roomId =
        meetingService.generateRoomId();

    const meetingCode =
        meetingService.generateMeetingCode();

    const meetingLink =
        meetingService.generateMeetingLink(
            roomId
        );

    // ==========================================
    // DATE COMPLETE
    // ==========================================
    const [hours, minutes] = time.split(":").map(Number);

    const scheduledAt = new Date(selectedDate);
    
    scheduledAt.setHours(
        hours,
        minutes,
        0,
        0
    );

    // ==========================================
    // CREER LA CONFERENCE
    // ==========================================
    const conference =
        await Conference.create({

            createdBy: admin._id,

            request: null,

            teacher: null,

            course: null,

            title,

            description: description || "",

            image: image || "",

            date: selectedDate,

            time,

            duration:
                duration || 60,

            maxParticipants:
                maxParticipants || 100,

            roomId,

            meetingCode,

            meetingLink,

            scheduledAt,

            isPublic: true,

            isActive: true,

            status: "scheduled"

        });

    // ==========================================
    // REPONSE
    // ==========================================
    return {

        success: true,

        message:
            "Conférence créée avec succès.",

        conference

    };

}

// =====================================================
// APPROUVER UNE DEMANDE
// =====================================================
async approveRequest(admin, requestId) {

    // ==========================================
    // VERIFIER LE ROLE
    // ==========================================

    if (admin.role !== "admin") {

        throw new Error(

            "Accès réservé aux administrateurs."

        );

    }

    // ==========================================
    // RECHERCHER LA DEMANDE
    // ==========================================

    const request = await ConferenceRequest.findById(requestId)
        .populate("teacher", "name email")
        .populate("course", "title");

    if (!request) {

        throw new Error(

            "Demande introuvable."

        );

    }

    // ==========================================
    // STATUT
    // ==========================================

    if (request.status === "approved") {

        throw new Error(

            "Cette demande est déjà approuvée."

        );

    }

    if (request.status === "rejected") {

        throw new Error(

            "Cette demande a déjà été refusée."

        );

    }

    // ==========================================
    // CONFERENCE EXISTANTE ?
    // ==========================================

    const exists = await Conference.findOne({

        request: request._id

    });

    if (exists) {

        throw new Error(

            "Une conférence existe déjà."

        );

    }

    // ==========================================
    // VALIDER
    // ==========================================

    request.status = "approved";

    request.approvedBy = admin._id;

    request.approvedAt = new Date();

    await request.save();

    // ==========================================
    // SALLE
    // ==========================================

    const roomId = meetingService.generateRoomId();

    const meetingCode = meetingService.generateMeetingCode();

    const meetingLink = meetingService.generateMeetingLink(roomId);

    // ==========================================
    // DATE COMPLETE
    // ==========================================

    const scheduledAt = new Date(

        `${request.date.toISOString().split("T")[0]}T${request.time}`

    );

    // ==========================================
    // CREATION DE LA CONFERENCE
    // ==========================================

    const conference = await Conference.create({

        request: request._id,

        teacher: request.teacher._id,

        course: request.course._id,

        title: request.title,

        description: request.description,

        image: request.image,

        date: request.date,

        time: request.time,

        duration: request.duration,

        maxParticipants: request.maxParticipants,

        roomId,

        meetingCode,

        meetingLink,

        approvedBy: admin._id,

        scheduledAt,

        status: "scheduled"

    });

// ==========================================
// NOTIFICATION ENSEIGNANT
// ==========================================

try {

    await notificationService.create({

        recipient: request.teacher._id,

        sender: admin._id,

        title: "Conférence approuvée",

        message: `Votre demande "${request.title}" a été approuvée.`,

        type: "conference_approved",

        entityType: "conference",

        entityId: conference._id

    });

}
catch (error) {

    console.error(
        "Erreur notification enseignant :",
        error.message
    );

}

// ==========================================
// EMAIL ENSEIGNANT
// ==========================================

try {

    await emailService.sendConferenceApproved(

        request.teacher,

        conference

    );

}
catch (error) {

    console.error(

        "Erreur email enseignant :",

        error.message

    );

}

// ==========================================
// ETUDIANTS INSCRITS
// ==========================================
const enrollments = await Enrollment.find({

    course: request.course._id

}).populate(

    "student",

    "name email"

);

for (const enrollment of enrollments) {

    const student = enrollment.student;

    if (!student) continue;

    // -------------------------------
    // Notification
    // -------------------------------

    try {

        await notificationService.create({

            recipient: student._id,

            sender: admin._id,

            title: "Nouvelle conférence",

            message: `Une conférence "${conference.title}" est disponible.`,

            type: "conference_scheduled",

            entityType: "conference",

            entityId: conference._id

        });

    }
    catch (error) {

        console.error(

            "Erreur notification étudiant :",

            error.message

        );

    }

    // -------------------------------
    // Email
    // -------------------------------

    try {

        await emailService.sendConferenceInvitation(

            student,

            conference

        );

    }
    catch (error) {

        console.error(

            "Erreur email étudiant :",

            error.message

        );

    }

}

return {

    success: true,

    message: "Conférence approuvée avec succès.",

    conference

};

}

// =====================================================
// REFUSER UNE DEMANDE
// =====================================================
async rejectRequest(

    admin,

    requestId,

    adminComment

) {

    // ==========================================
    // VERIFIER LE ROLE
    // ==========================================

    if (admin.role !== "admin") {

        throw new Error(

            "Accès réservé aux administrateurs."

        );

    }

    // ==========================================
    // RECHERCHER LA DEMANDE
    // ==========================================

    const request = await ConferenceRequest.findById(

        requestId

    );

    if (!request) {

        throw new Error(

            "Demande introuvable."

        );

    }

    // ==========================================
    // VERIFIER LE STATUT
    // ==========================================

    if (request.status === "approved") {

        throw new Error(

            "Cette demande est déjà approuvée."

        );

    }

    if (request.status === "rejected") {

        throw new Error(

            "Cette demande est déjà refusée."

        );

    }

    // ==========================================
    // REFUSER LA DEMANDE
    // ==========================================

    request.status = "rejected";

    request.adminComment = adminComment || "";

    request.approvedBy = admin._id;

    request.approvedAt = new Date();

    await request.save();

    // ==========================================
    // RECUPERER L'ENSEIGNANT
    // ==========================================

    const teacher = await User.findById(

        request.teacher

    );

    // ==========================================
    // NOTIFICATION
    // ==========================================

    try {

        await notificationService.create({

            recipient: request.teacher,

            sender: admin._id,

            title: "Conférence refusée",

            message:

                `Votre demande de conférence "${request.title}" a été refusée.`,

            type: "conference_rejected",

            entityType: "conferenceRequest",

            entityId: request._id

        });

    }

    catch (error) {

        console.error(

            "Erreur notification refus conférence :",

            error.message

        );

    }

    // ==========================================
    // EMAIL
    // ==========================================

    if (teacher) {

        try {

            await emailService.sendConferenceRejected(

                teacher,

                request

            );

        }

        catch (error) {

            console.error(

                "Erreur email refus conférence :",

                error.message

            );

        }

    }

    return {

        success: true,

        message:

            "Demande refusée.",

        request

    };

}


    // =====================================================
    // RECUPERER LES DEMANDES D'UN ENSEIGNANT
    // =====================================================
    async getTeacherRequests(teacher) {

        const requests = await ConferenceRequest.find({

            teacher: teacher._id

        })

        .populate(

            "course",

            "title",

        )


        .sort({

            createdAt: -1

        });

        return {

            success: true,

            requests

        };

    }

// =====================================================
// DETAILS D'UNE DEMANDE
// =====================================================

async getRequestById(teacher, requestId) {

    console.log("========== GET REQUEST BY ID ==========");
    console.log("ID reçu :", requestId);
    console.log("Utilisateur :", teacher._id);

    const request = await ConferenceRequest.findById(requestId)
        .populate("course", "title")
        .populate("approvedBy", "firstName lastName");

    console.log("Document trouvé :", request);

    if (!request) {

        throw new Error("Demande introuvable.");

    }

    console.log("Teacher enregistré :", request.teacher.toString());

    if (request.teacher.toString() !== teacher._id.toString()) {

        throw new Error("Accès refusé.");

    }

    return {

        success: true,

        request

    };

}


// =====================================================
// RECUPERER LES DEMANDES DE CONFERENCE (ADMIN)
// =====================================================
async getPendingRequests() {

    try {

        const requests = await ConferenceRequest.find()

            .populate({

                path: "teacher",

                select: "name email"

            })

            .populate({

                path: "course",

                select: "title"

            })

            .sort({

                createdAt: -1

            });

        console.log("=== DEMANDES DE CONFERENCES ===");
        console.log(requests);

        return {

            success: true,

            requests

        };

    }

    catch (error) {

        console.error("Erreur getPendingRequests :", error);

        throw new Error(

            "Impossible de récupérer les demandes de conférences."

        );

    }

}


// =====================================================
// CONFERENCES CREEES DIRECTEMENT PAR L'ADMIN
// =====================================================
async getAllConferences(admin) {

    // ==========================================
    // VERIFIER LE ROLE
    // ==========================================

    if (admin.role !== "admin") {

        throw new Error(
            "Accès réservé aux administrateurs."
        );

    }

    // ==========================================
    // RECUPERER UNIQUEMENT
    // LES CONFERENCES CREEES PAR CET ADMIN
    // ==========================================

    const conferences = await Conference.find({

        createdBy: admin._id

    })

    .populate(

        "createdBy",

        "name email"

    )

    .populate(

        "teacher",

        "name email"

    )

    .populate(

        "course",

        "title"

    )

    .sort({

        createdAt: -1

    });

    // ==========================================
    // REPONSE
    // ==========================================

    return {

        success: true,

        total: conferences.length,

        conferences

    };

}

// =====================================================
// DEMARRER UNE CONFERENCE
// =====================================================
async startConference(user, conferenceId) {

    const conference =
        await Conference.findById(conferenceId);

    // =====================================================
    // VERIFIER L'EXISTENCE
    // =====================================================
    if (!conference) {

        throw new Error(
            "Conférence introuvable."
        );

    }

    // =====================================================
    // VERIFIER L'AUTORISATION
    // =====================================================

    // -----------------------------------------
    // CONFERENCE CREEE PAR L'ADMIN
    // -----------------------------------------
    if (conference.createdBy) {

        if (user.role !== "admin") {

            throw new Error(
                "Seul l'administrateur créateur peut lancer cette conférence."
            );

        }

        if (
            conference.createdBy.toString()
            !==
            user._id.toString()
        ) {

            throw new Error(
                "Vous n'êtes pas autorisé à lancer cette conférence."
            );

        }

    }

    // -----------------------------------------
    // CONFERENCE CREEE PAR UN ENSEIGNANT
    // -----------------------------------------
    else {

        if (!conference.teacher) {

            throw new Error(
                "Cette conférence n'a aucun organisateur."
            );

        }

        if (
            conference.teacher.toString()
            !==
            user._id.toString()
        ) {

            throw new Error(
                "Vous n'êtes pas autorisé à lancer cette conférence."
            );

        }

    }

    // =====================================================
    // VERIFIER LE STATUT
    // =====================================================
    if (conference.status === "live") {

        throw new Error(
            "La conférence est déjà en cours."
        );

    }

    if (conference.status === "completed") {

        throw new Error(
            "Cette conférence est déjà terminée."
        );

    }

    if (conference.status === "cancelled") {

        throw new Error(
            "Cette conférence a été annulée."
        );

    }

    // Mise à jour
    conference.startedBy = user._id;

    conference.status = "live";

    conference.startedAt = new Date();

    await conference.save();

    // =====================================================
    // TEMPS REEL : CONFERENCE DEMARREE
    // =====================================================
    const io = getIO();
      if (io) {
          
        io.emit(
          "conference:started",
           {
            conference
           }
        );
      }

// =====================================================
// NOTIFIER LES ETUDIANTS
// =====================================================

let students = [];

// =====================================================
// CONFERENCE CREEE PAR L'ADMIN
// =====================================================

if (conference.createdBy && !conference.course) {

    students = await User.find({

        role: "student"

    });

}

// =====================================================
// CONFERENCE LIEE A UN COURS
// =====================================================

else if (conference.course) {

    const enrollments = await Enrollment.find({

        course: conference.course

    }).populate(

        "student",

        "name email"

    );

    students = enrollments

        .map(enrollment => enrollment.student)

        .filter(Boolean);

}

// =====================================================
// ENVOYER NOTIFICATIONS + EMAILS
// =====================================================

for (const student of students) {

    // ==========================
    // Notification
    // ==========================

    try {

        await notificationService.create({

            recipient: student._id,

            sender: user._id,

            title: "Conférence en direct",

            message:
                `${conference.title} vient de commencer.`,

            type: "conference_started",

            entityType: "conference",

            entityId: conference._id

        });

    }

    catch (error) {

        console.error(

            "Erreur notification étudiant :",

            error.message

        );

    }

    // ==========================
    // Email
    // ==========================

    try {

        await emailService.sendConferenceStarted(

            student,

            conference

        );

    }

    catch (error) {

        console.error(

            "Erreur email conférence :",

            error.message

        );

    }

}
    
    return {

        success: true,

        message: "La conférence a démarré.",

        conference

    };
   

}

// =====================================================
// TERMINER UNE CONFERENCE
// =====================================================
async endConference(user, conferenceId) {

    const conference = await Conference.findById(conferenceId);

    // =====================================================
    // CONFERENCE INTROUVABLE
    // =====================================================
    if (!conference) {

        throw new Error(
            "Conférence introuvable."
        );

    }

// =====================================================
// VERIFIER L'AUTORISATION
// =====================================================
// -----------------------------------------
// CONFERENCE CREEE PAR L'ADMIN
// -----------------------------------------
if (conference.createdBy) {

    if (user.role !== "admin") {

        throw new Error(
            "Seul l'administrateur créateur peut terminer cette conférence."
        );

    }

    if (
        conference.createdBy.toString()
        !==
        user._id.toString()
    ) {

        throw new Error(
            "Vous n'êtes pas autorisé à terminer cette conférence."
        );

    }

}

// -----------------------------------------
// CONFERENCE CREEE PAR UN ENSEIGNANT
// -----------------------------------------
else {

    if (!conference.teacher) {

        throw new Error(
            "Cette conférence n'a aucun organisateur."
        );

    }

    if (
        conference.teacher.toString()
        !==
        user._id.toString()
    ) {

        throw new Error(
            "Vous n'êtes pas autorisé à terminer cette conférence."
        );

    }

}

    // =====================================================
    // VERIFIER QUE LA CONFERENCE EST EN DIRECT
    // =====================================================
    if (conference.status !== "live") {

        throw new Error(
            "Seule une conférence en direct peut être terminée."
        );

    }

    // =====================================================
    // DATE DE FIN
    // =====================================================
    const endedAt = new Date();

    // =====================================================
    // CALCUL DE LA DUREE REELLE
    // =====================================================
    let actualDuration = 0;

    if (conference.startedAt) {

        actualDuration = Math.max(

            0,

            Math.round(

                (
                    endedAt -
                    conference.startedAt
                ) / 60000

            )

        );

    }

    // =====================================================
    // CALCUL DU TAUX DE PRESENCE
    // =====================================================
    let attendanceRate = 0;

    if (conference.maxParticipants > 0) {

        attendanceRate = Math.min(

            100,

            Number(

                (
                    conference.totalParticipants
                    /
                    conference.maxParticipants
                    *
                    100

                ).toFixed(2)

            )

        );

    }

    // =====================================================
    // MISE A JOUR DE LA CONFERENCE
    // =====================================================

    conference.status = "completed";

    conference.isActive = false;

    conference.endedAt = endedAt;

    conference.endedBy = user._id;

    conference.currentParticipants = 0;

    conference.actualDuration = actualDuration;

    conference.attendanceRate = attendanceRate;

    await conference.save();

    console.log(
        "================================================="
    );

    console.log(
        "🔴 CONFERENCE TERMINEE"
    );

    console.log(
        "Conference :",
        conference._id.toString()
    );

    console.log(
        "Terminee par :",
        user.name
    );

    console.log(
        "Statut :",
        conference.status
    );

    console.log(
        "isActive :",
        conference.isActive
    );

    console.log(
        "Duree reelle :",
        conference.actualDuration,
        "minutes"
    );

    console.log(
        "================================================="
    );

    // =====================================================
    // TEMPS REEL : PREVENIR TOUS LES UTILISATEURS
    // =====================================================
    const io = getIO();

    if (io) {

        io.emit(

            "conference:ended",

            {

                conference

            }

        );

    }

    // =====================================================
    // REPONSE
    // =====================================================
    return {

        success: true,

        message:
            "La conférence est terminée.",

        conference

    };

}

// =====================================================
// CONFERENCES DE L'ENSEIGNANT
// =====================================================
async getTeacherConferences(teacher) {

    const conferences = await Conference.find({

        teacher: teacher._id

    })

    .populate(

        "teacher",

        "name email"

    )

    .populate(

        "course",

        "title"

    )

    .populate(

        "request"

    )

    .sort({

        date: -1

    });

    return {

        success: true,

        conferences

    };

}

// =====================================================
// CONFERENCES DE L'ETUDIANT
// =====================================================

async getStudentConferences(student) {

    // Les cours auxquels l'étudiant est inscrit

    const enrollments = await Enrollment.find({

        student: student._id

    }).select("course");

    const courseIds = enrollments.map(

        enrollment => enrollment.course

    );

    const conferences = await Conference.find({

        course: {

            $in: courseIds

        },

        status: {

            $ne: "cancelled"

        }

    })

    .populate(

        "teacher",

        "name email"

    )

    .populate(

        "course",

        "title"

    )

    .sort({

        date: 1

    });

    return {

        success: true,

        conferences

    };

}

// =====================================================
// DETAILS D'UNE CONFERENCE
// =====================================================

async getConferenceById(id) {

    const conference = await Conference.findById(id)

    .populate(
        "teacher",
        "name email"
    )

    .populate(

        "course",

        "title"

    )
    
    .populate("request");

    if (!conference) {

        throw new Error(

            "Conférence introuvable."

        );

    }

    return {

        success: true,

        conference

    };

}

// =====================================================
// REJOINDRE UNE CONFERENCE
// =====================================================
async joinConference(user, conferenceId) {

    const conference = await Conference.findById(conferenceId);

    if (!conference) {

        throw new Error("Conférence introuvable.");

    }

    if (conference.status !== "live") {

        throw new Error("Cette conférence n'est pas encore en direct.");

    }

    // Vérifie si le participant est déjà présent

    const existingParticipant = await ConferenceParticipant.findOne({

        conference: conference._id,

        user: user._id,

        leftAt: null

    });

    if (existingParticipant) {

        throw new Error("Vous participez déjà à cette conférence.");

    }

    // Ajout du participant

    if (

        conference.currentParticipants
    
        >=
    
        conference.maxParticipants
    
    ) {
    
        throw new Error(
    
            "Cette conférence est complète."
    
        );
    
    }

    await ConferenceParticipant.create({

        conference: conference._id,

        user: user._id,

        joinedAt: new Date()

    });

    conference.currentParticipants++;

    conference.totalParticipants++;

    await conference.save();

    return {

        success: true,

        message: "Bienvenue dans la conférence.",

        roomId: conference.roomId,

        meetingLink: conference.meetingLink,

        meetingCode: conference.meetingCode

    };

}

// =====================================================
// QUITTER UNE CONFERENCE
// =====================================================
async leaveConference(user, conferenceId) {

    const participant = await ConferenceParticipant.findOne({

        conference: conferenceId,

        user: user._id,

        leftAt: null

    });

    if (!participant) {

        throw new Error("Vous n'êtes pas dans cette conférence.");

    }

    participant.leftAt = new Date();

    await participant.save();

    const conference = await Conference.findById(conferenceId);

    if (
    
    conference.currentParticipants > 0
    
    ){
    
    conference.currentParticipants--;
    
    }
    
    await conference.save();

    return {

        success: true,

        message: "Vous avez quitté la conférence."

    };

}

// =====================================================
// LISTE DES PARTICIPANTS
// =====================================================
async getParticipants(conferenceId) {

    const participants = await ConferenceParticipant.find({

        conference: conferenceId,

        leftAt: null

    })

    .populate(
        "user",
        "name email role"
    )

    .sort({

        joinedAt: 1

    });

    return {

        success: true,

        total: participants.length,

        participants

    };

}

// =====================================================
// ANNULER UNE CONFERENCE
// =====================================================

async cancelConference(teacher, conferenceId, reason = "") {

    const conference = await Conference.findById(conferenceId);

    if (!conference) {

        throw new Error("Conférence introuvable.");

    }

    if (conference.teacher.toString() !== teacher._id.toString()) {

        throw new Error(
            "Vous n'êtes pas autorisé à annuler cette conférence."
        );

    }

    if (conference.status === "completed") {

        throw new Error(
            "Impossible d'annuler une conférence terminée."
        );

    }

    conference.status = "cancelled";

    conference.cancelReason = reason;

    conference.isActive = false;

    await conference.save();

    // ==========================================
    // NOTIFICATION DES ETUDIANTS
    // ==========================================

    const students = await User.find({

        role: "student",

        enrolledCourses: conference.course

    });

    for (const student of students) {

        await notificationService.create({

            recipient: student._id,

            sender: teacher._id,

            title: "Conférence annulée",

            message: `La conférence "${conference.title}" a été annulée.`,

            type: "conference_cancelled",

            entityType: "conference",

            entityId: conference._id

        });

        await emailService.sendConferenceCancelled(

            student,

            conference

        );

    }

    return {

        success: true,

        message: "Conférence annulée.",

        conference

    };

}

// =====================================================
// MODIFIER UNE CONFERENCE
// =====================================================

async updateConference(

    teacher,

    conferenceId,

    data

) {

    const conference = await Conference.findById(

        conferenceId

    );

    if (!conference) {

        throw new Error(

            "Conférence introuvable."

        );

    }

    if (

        conference.teacher.toString()

        !==

        teacher._id.toString()

    ) {

        throw new Error(

            "Action non autorisée."

        );

    }

    if (

        conference.status === "completed"

    ) {

        throw new Error(

            "Impossible de modifier une conférence terminée."

        );

    }

    conference.title = data.title ?? conference.title;

    conference.description = data.description ?? conference.description;
    
    conference.image = data.image ?? conference.image;
    
    conference.date = data.date ?? conference.date;
    
    conference.time = data.time ?? conference.time;
    
    conference.duration = data.duration ?? conference.duration;
    
    conference.maxParticipants =
        data.maxParticipants ?? conference.maxParticipants;
    
    // Si tu utilises scheduledAt
    if (data.date || data.time) {
    
        const date = data.date ?? conference.date;
    
        const time = data.time ?? conference.time;
    
        conference.scheduledAt = new Date(
            `${new Date(date).toISOString().split("T")[0]}T${time}`
        );
    
    }

    await conference.save();

    return {

        success: true,

        message:

            "Conférence modifiée avec succès.",

        conference

    };

}

// =====================================================
// ANNULER / SUPPRIMER UNE CONFERENCE
// =====================================================
async deleteConference(user, conferenceId) {

    const conference = await Conference.findById(
        conferenceId
    );

    // =====================================================
    // CONFERENCE INTROUVABLE
    // =====================================================
    if (!conference) {

        throw new Error(
            "Conférence introuvable."
        );

    }

    // =====================================================
    // CONFERENCE CREEE PAR L'ADMIN
    // =====================================================
    if (conference.createdBy) {

        // ---------------------------------------------
        // VERIFIER QUE C'EST BIEN UN ADMIN
        // ---------------------------------------------
        if (user.role !== "admin") {

            throw new Error(
                "Seul l'administrateur peut gérer cette conférence."
            );

        }

        // ---------------------------------------------
        // VERIFIER QUE C'EST BIEN SON ADMINISTRATEUR
        // ---------------------------------------------
        if (
            conference.createdBy.toString()
            !==
            user._id.toString()
        ) {

            throw new Error(
                "Vous n'êtes pas autorisé à gérer cette conférence."
            );

        }

        // =================================================
        // CONFERENCE A VENIR
        // =================================================
        if (conference.status === "scheduled") {

            conference.status = "cancelled";

            conference.isActive = false;

            conference.cancelReason =
                "Conférence annulée par l'administrateur.";

            await conference.save();

            return {

                success: true,

                action: "cancelled",

                message:
                    "La conférence a été annulée.",

                conference

            };

        }

        // =================================================
        // CONFERENCE EN DIRECT
        // =================================================
        if (conference.status === "live") {

            throw new Error(
                "Impossible de supprimer une conférence en direct. Veuillez d'abord terminer la conférence."
            );

        }

        // =================================================
        // CONFERENCE ANNULEE OU TERMINEE
        // =================================================
        if (
            conference.status === "cancelled"
            ||
            conference.status === "completed"
        ) {

            await Conference.findByIdAndDelete(
                conferenceId
            );

            return {

                success: true,

                action: "deleted",

                message:
                    "La conférence a été supprimée définitivement."

            };

        }

    }

    // =====================================================
    // CONFERENCE CREEE PAR UN ENSEIGNANT
    // =====================================================
    if (conference.teacher) {

        if (user.role !== "teacher") {

            throw new Error(
                "Action non autorisée."
            );

        }

        if (
            conference.teacher.toString()
            !==
            user._id.toString()
        ) {

            throw new Error(
                "Vous n'êtes pas autorisé à gérer cette conférence."
            );

        }

        if (conference.status === "completed") {

            throw new Error(
                "Cette conférence est déjà terminée."
            );

        }

        if (conference.status === "live") {

            throw new Error(
                "Impossible de supprimer une conférence en direct."
            );

        }

        conference.status = "cancelled";

        conference.isActive = false;

        conference.cancelReason =
            "Conférence annulée par l'enseignant.";

        await conference.save();

        return {

            success: true,

            action: "cancelled",

            message:
                "La conférence a été annulée.",

            conference

        };

    }

    // =====================================================
    // AUCUN ORGANISATEUR
    // =====================================================
    throw new Error(
        "Cette conférence n'a aucun organisateur."
    );
}

// =====================================================
// SUPPRIMER UNE DEMANDE DE CONFERENCE
// =====================================================
async deleteRequest(admin, requestId) {

    // ==========================================
    // VERIFIER LE ROLE
    // ==========================================
    if (admin.role !== "admin") {

        throw new Error(

            "Accès réservé aux administrateurs."

        );

    }

    // ==========================================
    // RECHERCHER LA DEMANDE
    // ==========================================
    const request = await ConferenceRequest.findById(

        requestId

    );

    if (!request) {

        throw new Error(

            "Demande introuvable."

        );

    }

    // ==========================================
    // SUPPRIMER LA CONFERENCE ASSOCIEE
    // ==========================================
    try {
    
    await Conference.deleteMany({

        request: request._id

    });

       }

catch (error) {

    console.error(

        "Erreur suppression conférence :", error.message

    );

}

    // ==========================================
    // SUPPRIMER LA DEMANDE
    // ==========================================
    await ConferenceRequest.findByIdAndDelete(

        requestId

    );

    // ==========================================
    // REPONSE
    // ==========================================
    return {

        success: true,

        message: "Demande supprimée avec succès."

    };

}


// =====================================================
// CONFERENCES EN DIRECT
// =====================================================
async getLiveConferences() {

    const conferences = await Conference.find({

        status: "live",

        isActive: true

    })

    .populate(

        "teacher",

        "name email"

    )

    .populate(

        "course",

        "title"

    )

    .sort({

        startedAt: -1

    });

    return {

        success: true,

        total: conferences.length,

        conferences

    };

}


// =====================================================
// CONFERENCES PROGRAMMEES
// =====================================================
async getUpcomingConferences() {

    const conferences = await Conference.find({

        status: "scheduled",

        isActive: true

    })

    .populate(

        "teacher",

        "name email"

    )

    .populate(

        "course",

        "title"

    )

    .sort({

        date: 1,

        time: 1

    });

    return {

        success: true,

        total: conferences.length,

        conferences

    };

}


// =====================================================
// HISTORIQUE DES CONFERENCES
// =====================================================
async getHistoryConferences() {

    const conferences = await Conference.find({

        status: "completed"

    })

    .populate(

        "teacher",

        "name email"

    )

    .populate(

        "course",

        "title"

    )

    .sort({

        endedAt: -1

    });

    return {

        success: true,

        total: conferences.length,

        conferences

    };

}

};

export default new ConferenceService();