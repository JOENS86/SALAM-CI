import { useEffect, useRef } from "react";

function RemoteVideo({
    stream,
    name,
    muted = false,
    cameraEnabled = true
}) {

    const videoRef = useRef(null);

    useEffect(() => {

        if (!videoRef.current) return;

        if (!stream) {

            videoRef.current.srcObject = null;

            return;

        }

        videoRef.current.srcObject = stream;

        videoRef.current
            .play()
            .catch(() => {});

        return () => {

            if (videoRef.current) {

                videoRef.current.srcObject = null;

            }

        };

    }, [stream]);

    return (

        <div
            className="
                relative
                w-72
                h-44
                rounded-2xl
                overflow-hidden
                bg-[#111827]
                border
                border-white/20
                shadow-2xl
            "
        >

            {cameraEnabled && stream ? (

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={muted}
                    className="
                        w-full
                        h-full
                        object-cover
                    "
                />

            ) : (

                <div
                    className="
                        w-full
                        h-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        bg-[#111827]
                        text-white
                    "
                >

                    <div
                        className="
                            w-16
                            h-16
                            rounded-full
                            bg-blue-600
                            flex
                            items-center
                            justify-center
                            text-2xl
                            font-bold
                        "
                    >
                        {(name || "P").charAt(0).toUpperCase()}
                    </div>

                    <span
                        className="
                            mt-3
                            text-sm
                            font-medium
                        "
                    >
                        {name || "Participant"}
                    </span>

                </div>

            )}

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