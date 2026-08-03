// ============================================================
// CONVERTIR UNE IMAGE EN BASE64
// ============================================================

const imageToBase64 = (imageUrl) => {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.crossOrigin = "Anonymous";

        img.src = imageUrl;

        img.onload = () => {

            const canvas = document.createElement("canvas");

            canvas.width = img.width;

            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);

            resolve(

                canvas.toDataURL("image/png")

            );

        };

        img.onerror = reject;

    });

};

export default imageToBase64;