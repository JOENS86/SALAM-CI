// ======================================
// LAYOUT ÉTUDIANT
// ======================================
import DashboardLayout from "../../layouts/DashboardLayout"

// ======================================
// COMPOSANTS DU CATALOGUE
// ======================================
import CatalogHero from "../../components/catalog/CatalogHero";
import CatalogSearch from "../../components/catalog/CatalogSearch";
import CategoryFilter from "../../components/catalog/CategoryFilter";
import CourseGrid from "../../components/catalog/CourseGrid";

function Catalog() {

    return (

        // ======================================
        // LAYOUT PRINCIPAL DE L'ÉTUDIANT
        // ======================================
        <DashboardLayout>

            {/* ======================================
                HERO
                Titre + description du catalogue
            ====================================== */}
            <CatalogHero />

            {/* ======================================
                BARRE DE RECHERCHE
                (Statique pour le moment)
            ====================================== */}
            <CatalogSearch />

            {/* ======================================
                FILTRE PAR CATÉGORIE
                (Statique pour le moment)
            ====================================== */}
            <CategoryFilter />

            {/* ======================================
                LISTE DES COURS
            ====================================== */}
            <CourseGrid />

        </DashboardLayout>

    );

}

export default Catalog;