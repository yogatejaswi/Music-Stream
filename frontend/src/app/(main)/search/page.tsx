'use client';

import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { searchAPI, api } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import toast from 'react-hot-toast';

const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'R&B'];
const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'workout', 'chill'];
const languages = ['English', 'Spanish', 'French', 'Hindi', 'Korean', 'Japanese'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    language: '',
    year: '',
    explicit: '',
    sort: '-playCount'
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    try {
      // Simple search: just use the basic songs API with search parameter
      if (query.trim() && !hasActiveFilters) {
        const response = await api.get('/songs', {
          params: {
            search: query.trim(),
            limit: 50,
            sort: filters.sort
          }
        });
        setResults(response.data.data || []);
      } 
      // Advanced search with filters
      else {
        const params: any = {
          limit: 50,
          sort: filters.sort
        };
        
        if (query.trim()) params.q = query.trim();
        if (filters.genre) params.genre = filters.genre;
        if (filters.mood) params.mood = filters.mood;
        if (filters.language) params.language = filters.language;
        if (filters.year) params.year = filters.year;
        if (filters.explicit) params.explicit = filters.explicit;

        const response = await searchAPI.advanced(params);
        setResults(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      mood: '',
      language: '',
      year: '',
      explicit: '',
      sort: '-playCount'
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '-playCount');

  return (
    <div className="p-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3 max-w-4xl">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for songs, artists..."
              className="input pl-12 text-lg w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              showFilters || hasActiveFilters
                ? 'bg-primary-500 text-white'
                : 'bg-dark-200 text-gray-400 hover:text-white'
            }`}
          >
            <FaFilter />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-primary-500 text-xs px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(v => v && v !== '-playCount').length}
              </span>
            )}
          </button>
          
          <button
            type="submit"
            className="btn-primary px-8"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-dark-200 rounded-lg p-6 mb-6 max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-500 hover:underline flex items-center gap-2"
              >
                <FaTimes />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <select
                className="input"
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium mb-2">Mood</label>
              <select
                className="input"
                value={filters.mood}
                onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
              >
                <option value="">All Moods</option>
                {moods.map(m => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                className="input"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              >
                <option value="">All Languages</option>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="number"
                placeholder="e.g. 2024"
                className="input"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Explicit */}
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <select
                className="input"
                value={filters.explicit}
                onChange={(e) => setFilters({ ...filters, explicit: e.target.value })}
              >
                <option value="">All Content</option>
                <option value="false">Clean Only</option>
                <option value="true">Explicit Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                className="input"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              >
                <option value="-playCount">Most Popular</option>
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="-title">Title (Z-A)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleSearch()}
            className="btn-primary w-full mt-4"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">Searching...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {query ? `Results for "${query}"` : 'Search Results'} ({results.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {results.map((song, index) => (
              <SongCard
                key={song._id}
                song={song}
                allSongs={results}
                songIndex={index}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && (query || hasActiveFilters) && results.length === 0 && (
        <div className="text-center py-12">
          <FaSearch size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-xl text-gray-400 mb-2">No results found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {!loading && !query && !hasActiveFilters && results.length === 0 && (
        <div className="text-center py-12">
          <FaSearch size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-xl text-gray-400 mb-2">Search for music</p>
          <p className="text-gray-500">Use filters to discover new songs</p>
        </div>
      )}
    </div>
  );
}
