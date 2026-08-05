// =====================================================
// REPONSE DE SUCCES
// =====================================================

export const success = (

    res,

    message = "Opération effectuée avec succès.",

    data = null,

    status = 200

) => {

    return res.status(status).json({

        success: true,

        message,

        data

    });

};

// =====================================================
// REPONSE D'ERREUR
// =====================================================

export const failure = (

    res,

    message = "Une erreur est survenue.",

    status = 400,

    errors = null

) => {

    return res.status(status).json({

        success: false,

        message,

        errors

    });

};

// =====================================================
// REPONSE PAGINEE
// =====================================================

export const paginated = (

    res,

    message,

    data,

    pagination,

    status = 200

) => {

    return res.status(status).json({

        success: true,

        message,

        data,

        pagination

    });

};