import crypto from "crypto";

class MeetingService {

    // =====================================================
    // GENERER UN IDENTIFIANT UNIQUE DE SALLE
    // =====================================================

    generateRoomId() {

        return `SALAM-${crypto.randomUUID()}`;

    }

    // =====================================================
    // GENERER LE LIEN DE LA CONFERENCE
    // =====================================================

    generateMeetingLink(roomId) {

        return `${process.env.FRONTEND_URL}/conference/${roomId}`;

    }

    // =====================================================
    // GENERER UN CODE DE CONFERENCE
    // =====================================================

    generateMeetingCode() {

        return Math.random()

            .toString(36)

            .substring(2, 8)

            .toUpperCase();

    }

    // =====================================================
    // CONFERENCE EN DIRECT ?
    // =====================================================

    isConferenceLive(conference) {

        return conference.status === "live";

    }

    // =====================================================
    // CONFERENCE TERMINEE ?
    // =====================================================

    isConferenceCompleted(conference) {

        return conference.status === "completed";

    }

    // =====================================================
    // CONFERENCE PROGRAMMEE ?
    // =====================================================

    isConferenceScheduled(conference) {

        return conference.status === "scheduled";

    }

}

export default new MeetingService();