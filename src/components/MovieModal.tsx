import { useState } from "react";
import { X, Play, Heart, Star, ExternalLink, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

interface Movie {
  id: number;
  movie: string;
  rating: number;
  image: string;
  imdb_url: string;
}

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onWatchLater: (movieId: number) => void;
  isWatchLater: boolean;
}

export const MovieModal = ({ 
  movie, 
  isOpen, 
  onClose, 
  onWatchLater, 
  isWatchLater 
}: MovieModalProps) => {
  const [heartClicked, setHeartClicked] = useState(isWatchLater);

  if (!movie) return null;

  const handleWatchLater = () => {
    setHeartClicked(!heartClicked);
    onWatchLater(movie.id);
  };

  // Mock additional data for cinematic presentation
  const mockData = {
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: "2h 28m",
    releaseYear: 2023,
    director: "Director Name",
    description: "An epic cinematic journey that takes viewers on an unforgettable adventure through stunning visuals and compelling storytelling. This masterpiece combines cutting-edge cinematography with powerful performances to create an immersive experience that will leave audiences on the edge of their seats."
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-lg border-border/50 p-0">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 transition-smooth"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Hero Section with Movie Poster */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-t-lg">
            <img
              src={movie.image}
              alt={movie.movie}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 gradient-overlay" />
            
            {/* Movie Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
                    {movie.movie}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="gradient-primary font-semibold text-lg px-3 py-1">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {movie.rating.toFixed(1)}
                    </Badge>
                    <div className="flex items-center text-white/80">
                      <Calendar className="w-4 h-4 mr-1" />
                      {mockData.releaseYear}
                    </div>
                    <div className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-1" />
                      {mockData.duration}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockData.genre.map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-sm">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:items-end">
                  <Button
                    size="lg"
                    className="gradient-primary hover:scale-105 transition-bounce px-8 py-3 text-lg font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleWatchLater}
                    className={`hover:scale-105 transition-bounce px-6 py-3 ${
                      heartClicked ? 'bg-accent/20 text-accent border-accent' : ''
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${heartClicked ? 'fill-current' : ''}`} />
                    {heartClicked ? 'Added' : 'Watch Later'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Synopsis
                  </h3>
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {mockData.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Cast & Crew
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Director</span>
                      <p className="font-medium">{mockData.director}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <p className="font-medium">{movie.rating}/10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-xl p-6">
                  <h4 className="font-semibold mb-4 text-foreground">
                    Movie Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Runtime
                      </span>
                      <span className="font-medium">{mockData.duration}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Release Year
                      </span>
                      <span className="font-medium">{mockData.releaseYear}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Genres
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mockData.genre.map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full hover:scale-105 transition-bounce"
                  asChild
                >
                  <a 
                    href={movie.imdb_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on IMDB
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};