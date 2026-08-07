import conferenceService from "../services/conferenceService.js";

/* ===========================================================
   CREER UNE CONFERENCE
=========================================================== */
export const createConference = async (req, res) => {

    try {

        const result = await conferenceService.createConference(

            req.user,

            req.body

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

/* ===========================================================
   DEMARRER UNE CONFERENCE
=========================================================== */
export const startConference = async (req, res) => {

    try {

        const result = await conferenceService.startConference(

            req.user,

            req.params.id

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

/* ===========================================================
   TOUTES LES CONFERENCES (ADMIN)
=========================================================== */
export const getAllConferences = async (req, res) => {

    try {

        const result = await conferenceService.getAllConferences();

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ===========================================================
   MODIFIER UNE CONFERENCE
=========================================================== */
export const updateConference = async (req, res) => {

    try {

        const result = await conferenceService.updateConference(

            req.user,

            req.params.id,

            req.body

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

/* ===========================================================
   TERMINER UNE CONFERENCE
=========================================================== */
export const endConference = async (req, res) => {

    try {

        const result = await conferenceService.endConference(

            req.user,

            req.params.id

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

/* ===========================================================
   DETAILS D'UNE CONFERENCE
=========================================================== */
export const getConferenceById = async (req, res) => {

    try {

        const result = await conferenceService.getConferenceById(

            req.params.id

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

/* ===========================================================
   REJOINDRE UNE CONFERENCE
=========================================================== */
export const joinConference = async (req, res) => {

    try {

        const result = await conferenceService.joinConference(

            req.user,

            req.params.id

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

/* ===========================================================
   CONFERENCES DE L'ENSEIGNANT
=========================================================== */
export const getTeacherConferences = async (req, res) => {

    try {

        const result = await conferenceService.getTeacherConferences(

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

/* ===========================================================
   CONFERENCES DE L'ETUDIANT
=========================================================== */
export const getStudentConferences = async (req, res) => {

    try {

        const result = await conferenceService.getStudentConferences(

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


/* ===========================================================
   QUITTER UNE CONFERENCE
=========================================================== */
export const leaveConference = async (req, res) => {

    try {

        const result = await conferenceService.leaveConference(

            req.user,

            req.params.id

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

/* ===========================================================
   PARTICIPANTS DE LA CONFERENCE
=========================================================== */
export const getParticipants = async (req, res) => {

    try {

        const result = await conferenceService.getParticipants(

            req.params.id

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

/* ===========================================================
   SUPPRIMER LA CONFERENCE
=========================================================== */
export const deleteConference = async (req, res) => {

    try {

        const result = await conferenceService.deleteConference(

            req.user,

            req.params.id

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

import emailService from "../services/emailService.js";

/* ===========================================================
   TEST EMAIL
=========================================================== */

export const testEmail = async (req, res) => {

    try {

        await emailService.sendMail({

            to: process.env.MAIL_USER,

            subject: "Test SALAM CI",

            html: `

                <h1>Bonjour 👋</h1>

                <p>Si vous recevez cet email, alors le système d'envoi d'emails de SALAM CI fonctionne parfaitement.</p>

                <hr>

                <h3>SALAM CI</h3>

            `

        });

        res.json({

            success: true,

            message: "Email envoyé."

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ===========================================================
   CONFERENCES EN DIRECT
=========================================================== */
export const getLiveConferences = async (req, res) => {

    try {

        const result = await conferenceService.getLiveConferences();

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ===========================================================
   CONFERENCES PROGRAMMEES
=========================================================== */
export const getUpcomingConferences = async (req, res) => {

    try {

        const result = await conferenceService.getUpcomingConferences();

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ===========================================================
   HISTORIQUE DES CONFERENCES
=========================================================== */
export const getHistoryConferences = async (req, res) => {

    try {

        const result = await conferenceService.getHistoryConferences();

        res.json(result);

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};



