import { Search, Clock, MapPin, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { fetchCitySuggestions } from "../api";
import { CityResult } from "../types";

interface SearchBoxProps {
  onSearch: (query: string | CityResult) => void;
  isLoading: boolean;
  recentSearches?: string[];
}

export function SearchBox({ onSearch, isLoading, recentSearches = [] }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const data = await fetchCitySuggestions(query.trim());
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleRecentClick = (city: string) => {
    setQuery(city);
    onSearch(city);
    setShowDropdown(false);
  };

  const handleSuggestionClick = (city: CityResult) => {
    const fullName = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
    setQuery(fullName);
    onSearch(city);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showRecent = query.trim().length < 2 && recentSearches.length > 0;
  const showSuggestions = query.trim().length >= 2 && suggestions.length > 0;
  const showEmptyState = query.trim().length >= 2 && !isFetchingSuggestions && suggestions.length === 0;

  return (
    <div className="w-full max-w-md mx-auto relative" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative group flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            disabled={isLoading}
            className={cn(
              "w-full pl-12 pr-24 py-4 rounded-2xl border border-neutral-200 bg-white shadow-sm outline-none",
              "transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
              isLoading && "opacity-70 cursor-not-allowed",
              showDropdown && (showRecent || showSuggestions || query.trim().length >= 2) && "rounded-b-none border-b-transparent focus:border-b-transparent shadow-none"
            )}
          />
          
          {isFetchingSuggestions && (
            <div className="absolute right-24">
              <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={cn(
              "absolute right-2 px-5 py-2 rounded-xl bg-neutral-900 text-white font-medium text-sm",
              "transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      
      {showDropdown && (showRecent || showSuggestions || query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-neutral-200 rounded-b-2xl shadow-lg z-20 overflow-hidden max-h-[300px] overflow-y-auto">
          
          {/* Recent Searches */}
          {showRecent && (
            <>
              <div className="px-4 py-2 bg-neutral-50/50 border-b border-neutral-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Recent Searches</span>
              </div>
              <ul className="flex flex-col">
                {recentSearches.map((city) => (
                  <li key={city}>
                    <button
                      type="button"
                      onClick={() => handleRecentClick(city)}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between group"
                    >
                      <span className="font-medium">{city}</span>
                      <Search className="w-4 h-4 text-transparent group-hover:text-blue-500 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Autocomplete Suggestions */}
          {showSuggestions && (
            <>
              <div className="px-4 py-2 bg-neutral-50/50 border-b border-neutral-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Suggestions</span>
              </div>
              <ul className="flex flex-col">
                {suggestions.map((city) => (
                  <li key={`${city.id}-${city.name}`}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(city)}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-blue-50 transition-colors flex flex-col group"
                    >
                      <span className="font-medium group-hover:text-blue-700 transition-colors">{city.name}</span>
                      <span className="text-xs text-neutral-500">{[city.admin1, city.country].filter(Boolean).join(", ")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* No results state */}
          {showEmptyState && (
            <div className="px-4 py-6 text-center text-neutral-500 text-sm">
              No cities found matching "{query}"
            </div>
          )}

        </div>
      )}
    </div>
  );
}
