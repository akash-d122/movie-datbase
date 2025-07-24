import { useState, useRef } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

interface SearchFilters {
  minRating: number | null;
  sortBy: 'rating' | 'name' | 'recent';
}

export const SearchBar = ({ onSearch, onFilterChange }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minRating: null,
    sortBy: 'rating'
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { minRating: null, sortBy: 'rating' as const };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== null && v !== 'rating').length;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4 sm:px-0">
      {/* Main Search Bar */}
      <div 
        className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-smooth ${
          isFocused ? 'search-focus' : ''
        }`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-12 pr-12 py-4 sm:py-6 text-base sm:text-lg bg-card/80 backdrop-blur-sm border-border/50 
                     focus:border-primary focus:bg-card transition-smooth rounded-2xl"
          />
          {searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleSearch("")}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground 
                       hover:text-foreground transition-smooth p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="lg"
              className="px-4 sm:px-6 py-4 sm:py-6 rounded-2xl relative transition-smooth hover:scale-105 w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 p-0 flex items-center justify-center 
                               gradient-primary text-xs font-bold"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-card/95 backdrop-blur-sm border-border/50 rounded-xl"
          >
            <div className="p-2">
              <div className="mb-3">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[7, 8, 9].map((rating) => (
                    <Button
                      key={rating}
                      size="sm"
                      variant={filters.minRating === rating ? "default" : "outline"}
                      onClick={() => updateFilter('minRating', rating)}
                      className="flex-1 transition-smooth"
                    >
                      {rating}+
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sort By
                </label>
                <div className="space-y-1">
                  {[
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'name', label: 'A-Z' },
                    { value: 'recent', label: 'Recently Added' }
                  ].map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => updateFilter('sortBy', option.value)}
                      className={`cursor-pointer transition-smooth ${
                        filters.sortBy === option.value ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full mt-2 transition-smooth hover:scale-105"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || activeFiltersCount > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <Badge variant="secondary" className="px-3 py-1">
              Search: "{searchQuery}"
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSearch("")}
                className="ml-2 p-0 h-auto hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary" className="px-3 py-1">
              Rating: {filters.minRating}+
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateFilter('minRating', null)}
                className="ml-2 p-0 h-auto hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {filters.sortBy !== 'rating' && (
            <Badge variant="secondary" className="px-3 py-1">
              Sort: {filters.sortBy === 'name' ? 'A-Z' : 'Recent'}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateFilter('sortBy', 'rating')}
                className="ml-2 p-0 h-auto hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};