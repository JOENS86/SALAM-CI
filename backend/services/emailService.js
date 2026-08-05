import nodemailer from "nodemailer";

class EmailService {

    constructor() {

        console.log("MAIL_HOST =", process.env.MAIL_HOST);
        console.log("MAIL_PORT =", process.env.MAIL_PORT);
        console.log("MAIL_USER =", process.env.MAIL_USER);
    
        this.transporter = nodemailer.createTransport({
    
            host: process.env.MAIL_HOST,
    
            port: Number(process.env.MAIL_PORT),
    
            secure: false,
    
            auth: {
    
                user: process.env.MAIL_USER,
    
                pass: process.env.MAIL_PASS
    
            }
    
        });
    
    }
    
// =====================================================
// TEMPLATE HTML COMMUN
// =====================================================

getTemplate(title, content) {

    return `

    <!DOCTYPE html>

    <html>

    <head>

        <meta charset="UTF-8"/>

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
    // ENVOI D'UN EMAIL
    // =====================================================

    async sendMail({

        to,

        subject,

        html

    }) {

        return await this.transporter.sendMail({

            from: process.env.MAIL_FROM,

            to,

            subject,

            html

        });

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

}

export default new EmailService();