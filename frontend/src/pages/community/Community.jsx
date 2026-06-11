import {
    FaSearch,
    FaBell,
    FaUsers,
    FaHeart,
    FaComment,
    FaShare,
    FaPlus
  } from "react-icons/fa"
  
  function Community() {
  
    const user =
      JSON.parse(localStorage.getItem("user"))
  
    const posts = [
      {
        id: 1,
        author: "Prof. Koné Sékou",
        role: "Enseignant",
        category: "Intelligence Artificielle",
        content:
          "Excellente nouvelle pour nos étudiants ! Le module IA & Machine Learning vient d'être mis à jour avec plusieurs nouvelles leçons.",
        likes: 24,
        comments: 1,
        avatar: "KS"
      },
      {
        id: 2,
        author: "Ibrahim Touré",
        role: "Étudiant",
        category: "Développement Web",
        content:
          "J'ai un problème avec mon projet React. Quelqu'un peut-il m'aider avec useEffect ?",
        likes: 8,
        comments: 2,
        avatar: "IT"
      },
      {
        id: 3,
        author: "Dr. Fanta Bah",
        role: "Enseignant",
        category: "Cybersécurité",
        content:
          "Conseil de la semaine : ne jamais réutiliser le même mot de passe.",
        likes: 46,
        comments: 0,
        avatar: "FB"
      }
    ]
  
    return (
  
      <div className="min-h-screen bg-slate-100">
  
        {/* HEADER */}
  
        <div className="bg-white shadow-sm border-b">
  
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
  
            <div className="flex items-center gap-3">
  
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <FaUsers />
              </div>
  
              <h1 className="font-bold text-xl">
                SALAM CI
              </h1>
  
            </div>
  
            <div className="relative w-[400px]">
  
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
  
              <input
                type="text"
                placeholder="Rechercher des discussions..."
                className="
                w-full
                bg-slate-100
                rounded-xl
                py-3
                pl-11
                pr-4
                outline-none
                "
              />
  
            </div>
  
            <div className="flex items-center gap-5">
  
              <div className="relative">
  
                <FaBell className="text-xl text-gray-600" />
  
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </div>
  
              </div>
  
              <div className="flex items-center gap-2">
  
                <div className="w-10 h-10 bg-blue-500 rounded-full text-white flex items-center justify-center">
                  {user?.name?.charAt(0) || "U"}
                </div>
  
                <span className="font-medium">
                  {user?.name || user?.email}
                </span>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
        {/* CONTENU */}
  
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
  
          {/* COLONNE PRINCIPALE */}
  
          <div className="col-span-8">
  
            <div className="flex justify-between items-center mb-6">
  
              <div>
  
                <h1 className="text-3xl font-bold">
                  Communauté Active
                </h1>
  
                <p className="text-gray-500">
                  5 discussions dans la communauté
                </p>
  
              </div>
  
              <button
                className="
                bg-green-600
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
                Nouvelle publication
              </button>
  
            </div>
  
            {/* ZONE PUBLICATION */}
  
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
  
              <div className="flex gap-3">
  
                <div className="w-12 h-12 bg-blue-500 rounded-full text-white flex items-center justify-center">
                  {user?.name?.charAt(0) || "U"}
                </div>
  
                <input
                  type="text"
                  placeholder="Posez une question ou partagez quelque chose..."
                  className="
                  flex-1
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  "
                />
  
              </div>
  
            </div>
  
            {/* POSTS */}
  
            {posts.map((post) => (
  
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm p-5 mb-5"
              >
  
                <div className="flex items-center gap-3">
  
                  <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                    {post.avatar}
                  </div>
  
                  <div>
  
                    <h3 className="font-bold">
                      {post.author}
                    </h3>
  
                    <p className="text-sm text-gray-500">
                      {post.role} • {post.category}
                    </p>
  
                  </div>
  
                </div>
  
                <p className="mt-4 text-gray-700">
                  {post.content}
                </p>
  
                <div className="flex gap-8 mt-5 text-gray-500">
  
                  <button className="flex items-center gap-2">
                    <FaHeart />
                    {post.likes}
                  </button>
  
                  <button className="flex items-center gap-2">
                    <FaComment />
                    {post.comments}
                  </button>
  
                  <button className="flex items-center gap-2">
                    <FaShare />
                    Partager
                  </button>
  
                </div>
  
              </div>
  
            ))}
  
          </div>
  
          {/* SIDEBAR */}
  
          <div className="col-span-4 space-y-6">
  
            <div className="bg-white rounded-2xl shadow-sm p-5">
  
              <h2 className="font-bold text-xl mb-4">
                Catégories
              </h2>
  
              <div className="space-y-3">
  
                <p>Développement Web</p>
                <p>Réseaux Informatiques</p>
                <p>Cybersécurité</p>
                <p>Base de Données</p>
                <p>Intelligence Artificielle</p>
                <p>Orientation Professionnelle</p>
  
              </div>
  
            </div>
  
            <div className="bg-white rounded-2xl shadow-sm p-5">
  
              <h2 className="font-bold text-xl mb-4">
                Membres actifs
              </h2>
  
              <div className="space-y-4">
  
                <p>🟢 Prof. Koné Sékou</p>
                <p>🟢 Aïssatou Diallo</p>
                <p>🟢 Ibrahim Touré</p>
                <p>🟢 Dr. Fanta Bah</p>
                <p>🟢 Mamadou Camara</p>
  
              </div>
  
            </div>
  
            <div className="bg-white rounded-2xl shadow-sm p-5">
  
              <h2 className="font-bold text-xl mb-4">
                Tendances
              </h2>
  
              <div className="space-y-3">
  
                <p>#React</p>
                <p>#Cybersécurité</p>
                <p>#Python</p>
                <p>#IA</p>
                <p>#Réseaux</p>
                <p>#SQL</p>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default Community