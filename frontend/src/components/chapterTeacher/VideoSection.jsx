// ============================================================
// IMPORTS
// ============================================================
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
    FaVideo,
    FaPlus,
    FaPlay,
    FaEdit,
    FaTrash
} from "react-icons/fa";

import AddVideoModal from "./AddVideoModal";

// ============================================================
// COMPONENT
// ============================================================
function VideoSection({ chapterId }) {

    // ========================================================
    // LISTE DES VIDEOS
    // ========================================================

    const [videos, setVideos] = useState([]);

    // ========================================================
    // MODAL
    // ========================================================

    const [showModal, setShowModal] = useState(false);

// =======================================
// VIDEO SELECTIONNEE
// =======================================
const [selectedVideo, setSelectedVideo] = useState(null);

// =======================================
// VIDEO EN LECTURE
// =======================================
const [playingVideo, setPlayingVideo] = useState(null);

    // ========================================================
    // CHARGEMENT
    // ========================================================

    const [loading, setLoading] = useState(true);

    // =======================================
// MODAL SUPPRESSION
// =======================================

const [showDeleteModal, setShowDeleteModal] = useState(false);

const [videoToDelete, setVideoToDelete] = useState(null);

    // ========================================================
    // RECUPERATION DES VIDEOS
    // ========================================================

    const fetchVideos = async () => {

        try {

            const res = await axios.get(

                `http://localhost:5000/api/videos/chapter/${chapterId}`

            );

            setVideos(res.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ========================================================
    // AU CHARGEMENT
    // ========================================================

    useEffect(() => {

        fetchVideos();

    }, []);


    // ========================================================
    // Suppression video
    // ========================================================
    const deleteVideo = async (id) => {

        try {
    
            await axios.delete(
                `http://localhost:5000/api/videos/${id}`
            );
    
            toast.success(
                "Vidéo supprimée avec succès."
            );
    
            setShowDeleteModal(false);
            setVideoToDelete(null);
    
            fetchVideos();
    
        }
    
        catch(error){
    
            console.log(error);
    
            toast.error(
                "Impossible de supprimer la vidéo."
            );
    
        }
    
    };

    return (

        <div
            className="
                bg-gray-50
                rounded-2xl
                p-6
                mt-6
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <FaVideo className="text-red-500 text-2xl" />

                    <h3 className="text-2xl font-bold">

                        Vidéos

                    </h3>

                </div>

                <button

                    onClick={() => setShowModal(true)}

                    className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        flex
                        items-center
                        gap-2
                    "

                >

                    <FaPlus />

                    Ajouter

                </button>

            </div>

            {/* ================================================= */}
            {/* LISTE */}
            {/* ================================================= */}

            <div className="mt-8">

                {

                    loading ?

                    (

                        <p>Chargement...</p>

                    )

                    :

                    videos.length === 0 ?

                    (

                        <div className="text-center text-gray-500 py-10">

                            Aucune vidéo.

                        </div>

                    )

                    :

                    (

                        videos.map((video) => (

                            <div

                                key={video._id}

                                className="
                                    bg-white
                                    rounded-xl
                                    p-5
                                    mb-5
                                    shadow
                                "

                            >

                                <div className="flex justify-between">

                                    <div>

                                        <h4 className="font-bold text-xl">

                                            {video.title}

                                        </h4>

                                        <p className="text-gray-500 mt-2">

                                            {video.description}

                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">

                                            Durée : {video.duration}

                                        </p>

                                    </div>

                                    <div className="flex gap-3">

                                    <button
                                      onClick={() => setPlayingVideo(video)}
                                      className="
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        p-3
                                        rounded-xl "
                                    >
                                      <FaPlay/>
                                    </button>

                                        <button
                                          onClick={() => {
                                          setSelectedVideo(video);
                                          setShowModal(true);
                                        }}
                                            className="
                                                bg-green-600
                                                text-white
                                                p-3
                                                rounded-xl
                                            "

                                        >

                                            <FaEdit />

                                        </button>

                                        <button
                                            onClick={() => {
                                              setVideoToDelete(video);
                                              setShowDeleteModal(true);
                                            }}
                                            className="
                                                bg-red-600
                                                text-white
                                                p-3
                                                rounded-xl "
                                        >

                                            <FaTrash />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

            {

playingVideo && (

    <div className="mt-10">

        <h3 className="text-2xl font-bold mb-5">

            Lecture de la vidéo

        </h3>

        <video
          controls
          autoPlay
          className="w-full rounded-2xl"
          src={`http://localhost:5000/${playingVideo.video}`}
        />

    </div>

)

}

{/* =========================
    MODAL SUPPRESSION
========================= */}

{
  showDeleteModal && videoToDelete && (
    <div className=" fixed inset-0 bg-black/60 flex justify-center items-center z-50 ">
      <div className=" bg-white rounded-3xl w-[520px] shadow-2xl p-8 ">

          <div className=" flex justify-center mb-6 ">
            <div className=" w-20 h-20 rounded-full bg-red-100 flex items-center justify-center ">

        <FaTrash
          className=" text-red-600 text-3xl "
        />
            
            </div>
          </div>

          <h2 className=" text-3xl font-bold text-center ">
              Supprimer la vidéo ?
          </h2>

          <p className=" text-gray-500 text-center mt-5 leading-8 ">
              Vous êtes sur le point de supprimer définitivement cette vidéo.
                <br/>
              Cette action est irréversible.
          </p>

              <div className=" bg-gray-100 rounded-2xl mt-8 p-5 ">

                <h3 className=" font-bold text-xl ">
                  {videoToDelete.title}
                </h3>
                <p className=" text-gray-500 mt-2 ">
                  {videoToDelete.description}
                </p>

             </div>

            <div className=" flex justify-end gap-4 mt-10 ">
               
               <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setVideoToDelete(null);
                  }}
                  className=" px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 ">
                  Annuler
                </button>

                <button
                  onClick={() => 
                    deleteVideo(videoToDelete._id)
                  }
                  className=" px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white ">
                  Supprimer
                </button>

            </div>

      </div>
    </div>
  )
}

            {/* ================================================= */}
            {/* MODAL */}
            {/* ================================================= */}

            <AddVideoModal
                isOpen={showModal}
                onClose={() => {
                  setShowModal(false);
                  setSelectedVideo(null);
                }}
                chapterId={chapterId}
                video={selectedVideo}
                onVideoCreated={fetchVideos}
            />

        </div>

    );

}

export default VideoSection;