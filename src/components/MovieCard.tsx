import { useState } from "react";
import { Heart, Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Movie {
  id: number;
  movie: string;
  rating: number;
  image: string;
  imdb_url: string;
}

interface MovieCardProps {
  movie: Movie;
  onWatchLater: (movieId: number) => void;
  onMovieClick: (movie: Movie) => void;
  isWatchLater?: boolean;
}

export const MovieCard = ({ movie, onWatchLater, onMovieClick, isWatchLater = false }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heartClicked, setHeartClicked] = useState(isWatchLater);

  const handleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartClicked(!heartClicked);
    onWatchLater(movie.id);
  };

  return (
    <div 
      className="movie-card group min-w-[240px] sm:min-w-[280px] h-[360px] sm:h-[420px] bg-card border border-border/50"
      onClick={() => onMovieClick(movie)}
    >
      {/* Movie Poster */}
      <div className="relative h-[240px] sm:h-[320px] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
        <img
          src={movie.image}
          alt={movie.movie}
          className={`w-full h-full object-cover transition-smooth group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-smooth" />
        
        {/* Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth z-20">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button size="sm" className="gradient-primary hover:scale-110 transition-bounce text-xs sm:text-sm">
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Play
            </Button>
            <Button size="sm" variant="secondary" className="hover:scale-110 transition-bounce text-xs sm:text-sm">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Info
            </Button>
          </div>
        </div>

        {/* Watch Later Heart */}
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-3 right-3 z-30 hover:scale-125 transition-bounce ${
            heartClicked ? 'text-accent glow-accent heart-bounce' : 'text-white/70 hover:text-white'
          }`}
          onClick={handleWatchLater}
        >
          <Heart className={`w-5 h-5 ${heartClicked ? 'fill-current' : ''}`} />
        </Button>

        {/* Rating Badge */}
        <Badge className="absolute top-3 left-3 z-30 gradient-primary font-semibold">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {movie.rating.toFixed(1)}
        </Badge>
      </div>

      {/* Movie Info */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-smooth line-clamp-2">
          {movie.movie}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">Movie</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-primary hover:text-accent transition-smooth p-0 h-auto"
            asChild
          >
            <a href={movie.imdb_url} target="_blank" rel="noopener noreferrer">
              View IMDB
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};