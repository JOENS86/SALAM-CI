import API from "./api";

// =====================================================
// SERVICE CONFERENCES
// =====================================================

class ConferenceService {

    // =====================================================
    // CREER UNE DEMANDE
    // =====================================================

    async createRequest(data) {

        const response = await API.post(

            "/conference-requests",

            data

        );

        return response.data;

    }

    // =====================================================
    // DEMANDES DE L'ENSEIGNANT
    // =====================================================

    async getTeacherRequests() {

        const response = await API.get(

            "/conference-requests/teacher"

        );

        return response.data;

    }

// =====================================================
// DETAILS D'UNE DEMANDE
// =====================================================

async getRequestById(id) {

    const response = await API.get(

        `/conference-requests/${id}`

    );

    return response.data;

}

    // =====================================================
    // DEMANDES EN ATTENTE
    // =====================================================

    async getPendingRequests() {

        const response = await API.get(

            "/conference-requests/pending"

        );

        return response.data;

    }

    // =====================================================
    // APPROUVER UNE DEMANDE
    // =====================================================

    async approveRequest(id) {

        const response = await API.put(

            `/conference-requests/${id}/approve`

        );

        return response.data;

    }

    // =====================================================
    // REFUSER UNE DEMANDE
    // =====================================================

    async rejectRequest(

        id,

        adminComment

    ) {

        const response = await API.put(

            `/conference-requests/${id}/reject`,

            {

                adminComment

            }

        );

        return response.data;

    }

    // =====================================================
    // CREER UNE CONFERENCE
    // =====================================================

    async createConference(data) {

        const response = await API.post(

            "/conferences",

            data

        );

        return response.data;

    }

    // =====================================================
    // CONFERENCES ENSEIGNANT
    // =====================================================

    async getTeacherConferences() {

        const response = await API.get(

            "/conferences/teacher"

        );

        return response.data;

    }

    // =====================================================
    // CONFERENCES ETUDIANT
    // =====================================================

    async getStudentConferences() {

        const response = await API.get(

            "/conferences/student"

        );

        return response.data;

    }

    // =====================================================
    // TOUTES LES CONFERENCES
    // =====================================================

    async getAllConferences() {

        const response = await API.get(

            "/conferences/admin"

        );

        return response.data;

    }

    // =====================================================
    // DETAILS
    // =====================================================

    async getConferenceById(id) {

        const response = await API.get(

            `/conferences/${id}`

        );

        return response.data;

    }

    // =====================================================
    // MODIFIER
    // =====================================================

    async updateConference(

        id,

        data

    ) {

        const response = await API.put(

            `/conferences/${id}`,

            data

        );

        return response.data;

    }

    // =====================================================
    // SUPPRIMER
    // =====================================================

    async deleteConference(id) {

        const response = await API.delete(

            `/conferences/${id}`

        );

        return response.data;

    }

    // =====================================================
    // ANNULER
    // =====================================================

    async cancelConference(

        id,

        reason

    ) {

        const response = await API.put(

            `/conferences/${id}/cancel`,

            {

                reason

            }

        );

        return response.data;

    }

    // =====================================================
    // DEMARRER
    // =====================================================

    async startConference(id) {

        const response = await API.put(

            `/conferences/${id}/start`

        );

        return response.data;

    }

    // =====================================================
    // TERMINER
    // =====================================================

    async endConference(id) {

        const response = await API.put(

            `/conferences/${id}/end`

        );

        return response.data;

    }

    // =====================================================
    // REJOINDRE
    // =====================================================

    async joinConference(id) {

        const response = await API.post(

            `/conferences/${id}/join`

        );

        return response.data;

    }

    // =====================================================
    // QUITTER
    // =====================================================

    async leaveConference(id) {

        const response = await API.post(

            `/conferences/${id}/leave`

        );

        return response.data;

    }

    // =====================================================
    // PARTICIPANTS
    // =====================================================

    async getParticipants(id) {

        const response = await API.get(

            `/conferences/${id}/participants`

        );

        return response.data;

    }

}

export default new ConferenceService();