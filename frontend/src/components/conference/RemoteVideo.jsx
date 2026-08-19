import { useEffect, useRef } from "react";

function RemoteVideo({
    stream,
    name,
    muted = false,
    cameraEnabled = true
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

        <div
            className="
                relative
                w-full
                h-full
                rounded-2xl
                overflow-hidden
                bg-[#111827]
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
                        {(name || "P")
                            .charAt(0)
                            .toUpperCase()}
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
                    text-xs
                    px-3
                    py-2
                    truncate
                "
            >
                {name || "Participant"}
            </div>

        </div>

    );

}

export default RemoteVideo;