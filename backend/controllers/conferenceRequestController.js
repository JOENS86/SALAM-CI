import conferenceService from "../services/conferenceService.js";

/* ===========================================================
   CREER UNE DEMANDE DE CONFERENCE
=========================================================== */

export const createRequest = async (req, res) => {

    try {

        const result = await conferenceService.createRequest(

            req.user,

            req.body

        );

        return res.status(201).json(result);

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ===========================================================
   RECUPERER LES DEMANDES DE L'ENSEIGNANT
=========================================================== */

export const getTeacherRequests = async (req, res) => {

    try {

        const result = await conferenceService.getTeacherRequests(

            req.user

        );

        return res.status(200).json(result);

    }

    catch (error) {

        console.error("ERREUR GET TEACHER REQUESTS");
        console.error(error);
    
        return res.status(500).json({
    
            success: false,
    
            message: error.message
    
        });
    
    }

};


/* ===========================================================
   DEMANDES EN ATTENTE (ADMIN)
=========================================================== */

export const getPendingRequests = async (req, res) => {

    try {

        const result = await conferenceService.getPendingRequests();

        return res.status(200).json(result);

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ===========================================================
   ACCEPTER UNE DEMANDE
=========================================================== */

export const approveRequest = async (req, res) => {

    try {

        const result = await conferenceService.approveRequest(

            req.user,

            req.params.id

        );

        return res.status(200).json(result);

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ===========================================================
   REFUSER UNE DEMANDE
=========================================================== */

export const rejectRequest = async (req, res) => {

    try {

        const result = await conferenceService.rejectRequest(

            req.user,

            req.params.id,

            req.body.adminComment

        );

        return res.status(200).json(result);

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

export const getRequestById = async (req, res) => {

    try {

        const result = await conferenceService.getRequestById(

            req.user,

            req.params.id

        );

        return res.status(200).json(result);

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ===========================================================
   SUPPRIMER UNE DEMANDE
=========================================================== */
export const deleteRequest = async (req, res) => {

    console.log("DELETE CONTROLLER");

    console.log(req.params.id);

    try {

        const result = await conferenceService.deleteRequest(

            req.user,

            req.params.id

        );

        return res.status(200).json(result);

    }

    catch (error) {

        console.log(error);

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};