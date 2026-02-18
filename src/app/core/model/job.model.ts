export interface Job {
  id: number;
  name: string;                    // Titre du poste
  company: {
    id: number;
    name: string;                  // Nom de l'entreprise
    short_name?: string;
  };
  locations?: Array<{
    name: string;                  // Localisation
  }>;
  publication_date: string;        // Date de publication
  short_name: string;              // Description courte
  contents: string;                // Description complète
  refs: {
    landing_page: string;          // Lien vers l'offre complète
  };
  levels?: Array<{
    name: string;                  // Niveau d'expérience
    short_name: string;
  }>;
  categories?: Array<{
    name: string;                  // Catégorie du poste
  }>;
  type?: string;
  model_type?: string;
}

// Interface pour la réponse de l'API
export interface JobsResponse {
  results: Job[];
  page: number;
  page_count: number;
  total: number;
  items_per_page?: number;
  took?: number;
  timed_out?: boolean;
}

// Interface pour les filtres de recherche
export interface JobSearchFilters {
  page?: number;
  descending?: boolean;
  location?: string;
  category?: string;
  level?: string;
}