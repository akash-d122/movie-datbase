import { useState, useEffect } from "react";
import { Play, TrendingUp, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBanner from "@/assets/hero-banner.jpg";

interface Movie {
  id: number;
  movie: string;
  rating: number;
  image: string;
  imdb_url: string;
}

interface HeroSectionProps {
  featuredMovie?: Movie;
  totalMovies: number;
}

export const HeroSection = ({ featuredMovie, totalMovies }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate hero slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Star, label: "Average Rating", value: "8.2/10" },
    { icon: TrendingUp, label: "Total Movies", value: totalMovies.toLocaleString() },
    { icon: Users, label: "Active Users", value: "50K+" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Cinema Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-dark opacity-90" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Headline */}
        <div className="mb-8">
          <Badge className="gradient-primary text-lg px-6 py-2 mb-6 font-semibold">
            Welcome to CineVault
          </Badge>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 text-glow leading-tight">
            Discover
            <span className="block gradient-primary bg-clip-text text-transparent">
              Cinematic
            </span>
            Excellence
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Explore an immersive collection of movies with our premium database. 
            From blockbusters to hidden gems, find your next favorite film.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="gradient-primary hover:scale-105 transition-bounce px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Start Exploring
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-bounce px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
          >
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Top Rated Movies
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 
                       hover:bg-card/30 hover:scale-105 transition-smooth"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Movie Teaser */}
        {featuredMovie && (
          <div className="mt-16 bg-card/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Featured Movie
            </h3>
            <div className="flex items-center justify-center gap-4">
              <img
                src={featuredMovie.image}
                alt={featuredMovie.movie}
                className="w-16 h-24 object-cover rounded-lg"
              />
              <div className="text-left">
                <h4 className="text-xl font-semibold text-white">
                  {featuredMovie.movie}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-primary fill-current" />
                  <span className="text-white/80">
                    {featuredMovie.rating.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};