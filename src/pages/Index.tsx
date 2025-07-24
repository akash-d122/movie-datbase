import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { SearchBar } from "@/components/SearchBar";
import { MovieCarousel } from "@/components/MovieCarousel";
import { MovieModal } from "@/components/MovieModal";
import { BackToTop } from "@/components/BackToTop";
import { useToast } from "@/hooks/use-toast";
import { mockMovies } from "@/data/mockMovies";

interface Movie {
  id: number;
  movie: string;
  rating: number;
  image: string;
  imdb_url: string;
}

interface SearchFilters {
  minRating: number | null;
  sortBy: 'rating' | 'name' | 'recent';
}

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    minRating: null,
    sortBy: 'rating'
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchLaterIds, setWatchLaterIds] = useState<number[]>(() => {
    // Load from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('movie-database-watchlater');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const { toast } = useToast();

  // Save watchLaterIds to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('movie-database-watchlater', JSON.stringify(watchLaterIds));
    }
  }, [watchLaterIds]);

  // Fetch movies from API with fallback to mock data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const response = await fetch('https://dummyapi.online/api/movies');
        
        if (!response.ok) {
          throw new Error('API response not ok');
        }
        
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data);
        
        toast({
          title: "Movies Loaded",
          description: `Successfully loaded ${data.length} movies from API`,
        });
        
      } catch (error) {
        console.warn('API fetch failed, using mock data:', error);
        
        // Fallback to mock data
        setMovies(mockMovies);
        setFilteredMovies(mockMovies);
        
        toast({
          title: "Demo Mode",
          description: "Using sample movie data for demonstration",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [toast]);

  // Filter and sort movies
  useEffect(() => {
    let filtered = [...movies];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.movie.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply rating filter
    if (filters.minRating) {
      filtered = filtered.filter(movie => movie.rating >= filters.minRating!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.movie.localeCompare(b.movie);
        case 'recent':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  }, [movies, searchQuery, filters]);

  const handleWatchLater = (movieId: number) => {
    setWatchLaterIds(prev => {
      const isAdded = prev.includes(movieId);
      const newIds = isAdded 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId];
      
      toast({
        title: isAdded ? "Removed from Watch Later" : "Added to Watch Later",
        description: isAdded 
          ? "Movie removed from your watch later list"
          : "Movie added to your watch later list",
      });
      
      return newIds;
    });
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // Get categorized movies
  const topRatedMovies = filteredMovies.filter(movie => movie.rating >= 8);
  const popularMovies = filteredMovies.slice(0, 20);
  const watchLaterMovies = movies.filter(movie => watchLaterIds.includes(movie.id));
  const featuredMovie = movies.find(movie => movie.rating >= 9) || movies[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Loading Movie Database
          </h2>
          <p className="text-muted-foreground">
            Preparing your cinematic experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection featuredMovie={featuredMovie} totalMovies={movies.length} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search Bar */}
        <SearchBar 
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
        />

        {/* Movie Sections */}
        <div className="space-y-16">
          {/* Search Results or All Movies */}
          {searchQuery || filters.minRating || filters.sortBy !== 'rating' ? (
            <MovieCarousel
              title={`Search Results (${filteredMovies.length})`}
              movies={filteredMovies}
              onWatchLater={handleWatchLater}
              onMovieClick={handleMovieClick}
              watchLaterIds={watchLaterIds}
            />
          ) : (
            <>
              {/* Top Rated Movies */}
              <MovieCarousel
                title="Top Rated Movies"
                movies={topRatedMovies}
                onWatchLater={handleWatchLater}
                onMovieClick={handleMovieClick}
                watchLaterIds={watchLaterIds}
              />

              {/* Popular Movies */}
              <MovieCarousel
                title="Popular Movies"
                movies={popularMovies}
                onWatchLater={handleWatchLater}
                onMovieClick={handleMovieClick}
                watchLaterIds={watchLaterIds}
              />

              {/* Watch Later */}
              {watchLaterMovies.length > 0 && (
                <MovieCarousel
                  title="Watch Later"
                  movies={watchLaterMovies}
                  onWatchLater={handleWatchLater}
                  onMovieClick={handleMovieClick}
                  watchLaterIds={watchLaterIds}
                />
              )}

              {/* All Movies */}
              <MovieCarousel
                title="All Movies"
                movies={filteredMovies}
                onWatchLater={handleWatchLater}
                onMovieClick={handleMovieClick}
                watchLaterIds={watchLaterIds}
              />
            </>
          )}
        </div>
      </div>

      {/* Movie Detail Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={handleCloseModal}
        onWatchLater={handleWatchLater}
        isWatchLater={selectedMovie ? watchLaterIds.includes(selectedMovie.id) : false}
      />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Index;
