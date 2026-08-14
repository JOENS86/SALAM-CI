import { useEffect, useRef } from "react";

function MainVideo({ stream, muted = false }) {

    const videoRef = useRef(null);

    useEffect(() => {

        if (!videoRef.current || !stream) return;
    
        videoRef.current.srcObject = stream;
    
        videoRef.current.play().catch(console.error);
    
        return () => {
    
            if (videoRef.current) {
    
                videoRef.current.srcObject = null;
    
            }
    
        };
    
    }, [stream]);

    return (

        <video

            ref={videoRef}

            autoPlay

            playsInline

            controls={false}

            muted={muted}

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