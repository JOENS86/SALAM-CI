import { useEffect, useRef } from "react";

function MainVideo({
    stream,
    muted = false
}) {

    const videoRef = useRef(null);

    useEffect(() => {

        const video =
            videoRef.current;

        if (!video) return;

        video.srcObject =
            stream || null;

        if (stream) {

            video.play()
                .catch(() => {});

        }

        return () => {

            if (video) {
                video.srcObject = null;
            }

        };

    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            controls={false}
            className="
                w-full
                h-full
                object-cover
                rounded-3xl
            "
        />
    );

}

export default MainVideo;