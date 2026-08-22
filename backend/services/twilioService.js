import twilio from "twilio"

// =====================================================
// CONFIGURATION TWILIO
// =====================================================

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const VERIFY_SERVICE_SID =
  process.env.TWILIO_VERIFY_SERVICE_SID


// =====================================================
// ENVOYER LE CODE OTP
// =====================================================

export const sendVerificationCode = async (phone) => {

  try {

    if (!phone) {

      throw new Error(
        "Numéro de téléphone obligatoire."
      )

    }

    if (!VERIFY_SERVICE_SID) {

      throw new Error(
        "TWILIO_VERIFY_SERVICE_SID n'est pas configuré."
      )

    }

    const verification =
      await client.verify.v2
        .services(VERIFY_SERVICE_SID)
        .verifications
        .create({

          to: phone,

          channel: "sms"

        })

    console.log(
      "📱 SMS OTP envoyé vers :",
      phone
    )

    console.log(
      "📱 Statut Twilio :",
      verification.status
    )

    return verification

  }

  catch (error) {

    console.error(
      "❌ ERREUR ENVOI SMS TWILIO :",
      error.message
    )

    throw error

  }

}


// =====================================================
// VÉRIFIER LE CODE OTP
// =====================================================

export const verifyVerificationCode = async (
  phone,
  code
) => {

  try {

    if (!phone) {

      throw new Error(
        "Numéro de téléphone obligatoire."
      )

    }

    if (!code) {

      throw new Error(
        "Code de vérification obligatoire."
      )

    }

    if (!VERIFY_SERVICE_SID) {

      throw new Error(
        "TWILIO_VERIFY_SERVICE_SID n'est pas configuré."
      )

    }

    const verificationCheck =
      await client.verify.v2
        .services(VERIFY_SERVICE_SID)
        .verificationChecks
        .create({

          to: phone,

          code

        })

    console.log(
      "📱 Vérification OTP :",
      verificationCheck.status
    )

    return verificationCheck

  }

  catch (error) {

    console.error(
      "❌ ERREUR VÉRIFICATION OTP TWILIO :",
      error.message
    )

    throw error

  }

}