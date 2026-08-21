import { Resend } from "resend";

class EmailService {

    constructor() {

        console.log(
            "📧 Initialisation EmailService avec Resend"
        );

        console.log(
            "RESEND_API_KEY présente :",
            Boolean(process.env.RESEND_API_KEY)
        );

        console.log(
            "MAIL_FROM =",
            process.env.MAIL_FROM
        );

        this.resend = new Resend(
            process.env.RESEND_API_KEY
        );

    }


// =====================================================
// TEMPLATE HTML COMMUN
// =====================================================

getTemplate(title, content) {

    return `

    <!DOCTYPE html>

    <html lang="fr">

    <head>

        <meta charset="UTF-8"/>

        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />

        <style>

            body{

                margin:0;

                padding:0;

                background:#f5f5f5;

                font-family:Arial,Helvetica,sans-serif;

            }

            .container{

                max-width:650px;

                margin:30px auto;

                background:#ffffff;

                border-radius:12px;

                overflow:hidden;

                box-shadow:0 10px 25px rgba(0,0,0,.08);

            }

            .header{

                background:#7c3aed;

                color:#fff;

                padding:35px;

                text-align:center;

            }

            .header h1{

                margin:0;

                font-size:28px;

            }

            .content{

                padding:35px;

                color:#444;

                line-height:1.8;

            }

            .footer{

                background:#fafafa;

                padding:20px;

                text-align:center;

                color:#888;

                font-size:13px;

            }

            .btn{

                display:inline-block;

                margin-top:25px;

                padding:14px 26px;

                background:#7c3aed;

                color:white;

                text-decoration:none;

                border-radius:8px;

                font-weight:bold;

            }

        </style>

    </head>

    <body>

        <div class="container">

            <div class="header">

                <h1>SALAM CI</h1>

                <p>${title}</p>

            </div>

            <div class="content">

                ${content}

            </div>

            <div class="footer">

                © ${new Date().getFullYear()} SALAM CI

                <br/>

                Plateforme intelligente d'E-learning

            </div>

        </div>

    </body>

    </html>

    `;

}


// =====================================================
// ENVOI D'UN EMAIL AVEC RESEND
// =====================================================

async sendMail({

    to,

    subject,

    html

}) {

    try {

        console.log(
            "📧 Envoi email Resend vers :",
            to
        );

        const { data, error } =
            await this.resend.emails.send({

                from:
                    process.env.MAIL_FROM ||
                    "onboarding@resend.dev",

                to,

                subject,

                html

            });


        if (error) {

            console.error(
                "❌ Erreur Resend :",
                error
            );

            throw new Error(
                error.message ||
                "Erreur lors de l'envoi de l'email."
            );

        }


        console.log(
            "✅ Email Resend envoyé :",
            data
        );

        return data;

    }

    catch (error) {

        console.error(
            "❌ Erreur sendMail :",
            error.message
        );

        throw error;

    }

}


// =====================================================
// DEMANDE DE CONFERENCE ENVOYEE
// =====================================================

async sendConferenceRequestToAdmin(

    admin,

    teacher,

    request

){

    const html = this.getTemplate(

        "Nouvelle demande de conférence",

        `

        <h2>Bonjour ${admin.name},</h2>

        <p>

        L'enseignant

        <strong>

        ${teacher.name}

        </strong>

        vient de demander l'organisation d'une conférence.

        </p>

        <p>

        <strong>Titre :</strong>

        ${request.title}

        </p>

        <p>

        <strong>Date :</strong>

        ${new Date(request.date).toLocaleDateString("fr-FR")}

        </p>

        <p>

        Merci de vous connecter à SALAM CI afin de traiter cette demande.

        </p>

        `

    );

    return await this.sendMail({

        to: admin.email,

        subject: "Nouvelle demande de conférence",

        html

    });

}


// =====================================================
// CONFERENCE APPROUVEE
// =====================================================

async sendConferenceApproved(

    teacher,

    conference

) {

    const html = this.getTemplate(

        "Votre conférence a été approuvée",

        `

        <h2>Bonjour ${teacher.name},</h2>

        <p>

        Votre demande de conférence a été

        <strong style="color:green;">

        approuvée

        </strong>

        par l'administrateur.

        </p>

        <p>

        <strong>Conférence :</strong>

        ${conference.title}

        </p>

        <p>

        <strong>Date :</strong>

        ${new Date(conference.date).toLocaleDateString("fr-FR")}

        </p>

        <p>

        <strong>Heure :</strong>

        ${conference.time}

        </p>

        <p>

        Vous pourrez lancer cette conférence depuis votre espace enseignant.

        </p>

        `

    );

    return await this.sendMail({

        to: teacher.email,

        subject: "Conférence approuvée",

        html

    });

}


// =====================================================
// CONFERENCE REFUSEE
// =====================================================

async sendConferenceRejected(

    teacher,

    request

){

    const html = this.getTemplate(

        "Demande refusée",

        `

        <h2>Bonjour ${teacher.name},</h2>

        <p>

        Votre demande de conférence

        <strong>

        ${request.title}

        </strong>

        a malheureusement été refusée.

        </p>

        <p>

        Vous pouvez modifier votre demande et en soumettre une nouvelle.

        </p>

        `

    );

    return await this.sendMail({

        to: teacher.email,

        subject: "Conférence refusée",

        html

    });

}


// =====================================================
// INVITATION ETUDIANT
// =====================================================

async sendConferenceInvitation(

    student,

    conference

){

    const html = this.getTemplate(

        "Invitation à une conférence",

        `

        <h2>Bonjour ${student.name},</h2>

        <p>

        Une nouvelle conférence est disponible.

        </p>

        <p>

        <strong>${conference.title}</strong>

        </p>

        <p>

        Date :

        ${new Date(conference.date).toLocaleDateString("fr-FR")}

        </p>

        <p>

        Heure :

        ${conference.time}

        </p>

        <a

            class="btn"

            href="${conference.meetingLink}"

        >

            Rejoindre la conférence

        </a>

        `

    );

    return this.sendMail({

        to: student.email,

        subject: "Invitation conférence",

        html

    });

}


// =====================================================
// RAPPEL
// =====================================================

async sendConferenceReminder(

    student,

    conference

){

    const html = this.getTemplate(

        "Rappel de conférence",

        `

        <h2>Bonjour ${student.name},</h2>

        <p>

        Nous vous rappelons que votre conférence

        commence dans moins de 30 minutes.

        </p>

        <p>

        <strong>

        ${conference.title}

        </strong>

        </p>

        <a

            class="btn"

            href="${conference.meetingLink}"

        >

            Rejoindre

        </a>

        `

    );

    return this.sendMail({

        to: student.email,

        subject: "Rappel conférence",

        html

    });

}


// =====================================================
// CONFERENCE DEMARREE
// =====================================================

async sendConferenceStarted(

    student,

    conference

){

    const html = this.getTemplate(

        "La conférence est en direct",

        `

        <h2>Bonjour ${student.firstName},</h2>

        <p>

        Votre enseignant vient de démarrer la conférence.

        </p>

        <a

            class="btn"

            href="${conference.meetingLink}"

        >

            Rejoindre maintenant

        </a>

        `

    );

    return this.sendMail({

        to: student.email,

        subject: "Conférence en direct",

        html

    });

}


// =====================================================
// CONFERENCE ANNULEE
// =====================================================

async sendConferenceCancelled(

    student,

    conference

){

    const html = this.getTemplate(

        "Conférence annulée",

        `

        <h2>Bonjour ${student.name},</h2>

        <p>

        La conférence

        <strong>

        ${conference.title}

        </strong>

        a été annulée.

        </p>

        <p>

        Nous vous informerons dès qu'une nouvelle date sera programmée.

        </p>

        `

    );

    return this.sendMail({

        to: student.email,

        subject: "Conférence annulée",

        html

    });

}


// =====================================================
// EMAIL RÉINITIALISATION MOT DE PASSE
// =====================================================
async sendPasswordResetEmail(

    user,

    resetUrl

) {

    const html = this.getTemplate(

        "Réinitialisation de votre mot de passe",

        `

        <h2>
            Bonjour ${user.name},
        </h2>

        <p>

            Une demande de réinitialisation
            de votre mot de passe a été effectuée
            pour votre compte SALAM CI.

        </p>

        <p>

            Cliquez sur le bouton ci-dessous
            pour définir un nouveau mot de passe.

        </p>

        <div style="text-align:center;">

            <a
                class="btn"
                href="${resetUrl}"
            >

                Réinitialiser mon mot de passe

            </a>

        </div>

        <p>

            <strong>
                Ce lien expire dans 15 minutes.
            </strong>

        </p>

        <p>

            Si vous n'êtes pas à l'origine
            de cette demande, vous pouvez
            simplement ignorer cet email.

        </p>

        `

    )

    return this.sendMail({

        to: user.email,

        subject:
            "Réinitialisation de votre mot de passe - SALAM CI",

        html

    })

}

}

export default new EmailService();