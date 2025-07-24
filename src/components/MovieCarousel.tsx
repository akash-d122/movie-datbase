import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "./MovieCard";

interface Movie {
  id: number;
  movie: string;
  rating: number;
  image: string;
  imdb_url: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onWatchLater: (movieId: number) => void;
  onMovieClick: (movie: Movie) => void;
  watchLaterIds: number[];
}

export const MovieCarousel = ({ 
  title, 
  movies, 
  onWatchLater, 
  onMovieClick, 
  watchLaterIds 
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 260 : 320; // Smaller scroll on mobile
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-glow">
          {title}
        </h2>
        <div className="hidden sm:flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('left')}
            className="rounded-full w-10 h-10 p-0 hover:bg-primary/10 hover:scale-110 transition-bounce"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('right')}
            className="rounded-full w-10 h-10 p-0 hover:bg-primary/10 hover:scale-110 transition-bounce"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Movie List */}
      <div 
        ref={scrollRef}
        className="flex space-x-4 sm:space-x-6 overflow-x-auto carousel-scroll pb-4"
        style={{ 
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '16px'
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} style={{ scrollSnapAlign: 'start' }}>
            <MovieCard
              movie={movie}
              onWatchLater={onWatchLater}
              onMovieClick={onMovieClick}
              isWatchLater={watchLaterIds.includes(movie.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};