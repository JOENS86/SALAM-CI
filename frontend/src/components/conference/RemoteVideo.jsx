import { useEffect, useRef } from "react";

function RemoteVideo({ stream, name }) {

    const videoRef = useRef(null);

    useEffect(() => {

        if (!videoRef.current || !stream) return;

        videoRef.current.srcObject = stream;

        videoRef.current
            .play()
            .catch(console.error);

    }, [stream]);

    return (

        <div
            className="
                relative
                w-72
                h-44
                rounded-2xl
                overflow-hidden
                bg-black
                border-4
                border-white
                shadow-2xl
            "
        >

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                className="
                    w-full
                    h-full
                    object-cover
                "
            />

            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    bg-black/60
                    text-white
                    text-sm
                    px-3
                    py-2
                "
            >
                {name || "Participant"}
            </div>

        </div>

    );

}

export default RemoteVideo;