'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaFilter, FaTimes, FaHistory, FaFire } from 'react-icons/fa';
import { api } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import toast from 'react-hot-toast';

const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'R&B'];
const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'workout', 'chill'];
const languages = ['English', 'Spanish', 'French', 'Hindi', 'Telugu', 'Tamil', 'Korean', 'Japanese'];
const quickSearches = ['Chill Vibes', 'Workout Mix', 'Telugu Hits', 'Love Songs', 'Fresh Releases'];
const recentSearchesStorageKey = 'music-stream-recent-searches';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    language: '',
    year: '',
    explicit: '',
    sort: '-playCount'
  });

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value && value !== '-playCount'),
    [filters]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedSearches = window.localStorage.getItem(recentSearchesStorageKey);
    if (!savedSearches) return;

    try {
      const parsedSearches = JSON.parse(savedSearches);
      if (Array.isArray(parsedSearches)) {
        setRecentSearches(parsedSearches.filter((item) => typeof item === 'string'));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  const updateRecentSearches = (searchTerm: string) => {
    if (typeof window === 'undefined') return;

    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) return;

    const updatedSearches = [
      trimmedSearch,
      ...recentSearches.filter((item) => item.toLowerCase() !== trimmedSearch.toLowerCase()),
    ].slice(0, 6);

    setRecentSearches(updatedSearches);
    window.localStorage.setItem(recentSearchesStorageKey, JSON.stringify(updatedSearches));
  };

  const syncUrl = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }

    const queryString = params.toString();
    router.replace(queryString ? `/search?${queryString}` : '/search');
  };

  const runSearch = async (
    searchTerm = query,
    options: { syncQueryString?: boolean } = {}
  ) => {
    const trimmedQuery = searchTerm.trim();

    if (!trimmedQuery && !hasActiveFilters) {
      setResults([]);
      if (options.syncQueryString !== false) {
        syncUrl('');
      }
      return;
    }

    setLoading(true);

    try {
      const params: any = {
        limit: 50,
        sort: filters.sort
      };

      if (trimmedQuery) {
        params.search = trimmedQuery;
      }

      if (filters.genre) params.genre = filters.genre;
      if (filters.mood) params.mood = filters.mood;
      if (filters.language) params.language = filters.language;
      if (filters.year) params.year = filters.year;
      if (filters.explicit) params.explicit = filters.explicit;

      const response = await api.get('/songs', { params });
      const foundSongs = response.data.data || [];

      setResults(foundSongs);

      if (trimmedQuery) {
        updateRecentSearches(trimmedQuery);
      }

      if (options.syncQueryString !== false) {
        syncUrl(trimmedQuery);
      }

      if (foundSongs.length === 0) {
        toast.info('No songs found matching your search');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Search failed: ' + (error.response?.data?.message || error.message));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runSearch(query);
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

  const applyQuickSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    await runSearch(searchTerm);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(recentSearchesStorageKey);
    }
  };

  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';

    if (urlQuery) {
      setQuery(urlQuery);
      void runSearch(urlQuery, { syncQueryString: false });
      return;
    }

    setQuery('');
    setResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="p-6">
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
                {Object.values(filters).filter((value) => value && value !== '-playCount').length}
              </span>
            )}
          </button>

          <button type="submit" className="btn-primary px-8">
            Search
          </button>
        </div>
      </form>

      <div className="max-w-4xl space-y-4 mb-6">
        {recentSearches.length > 0 && (
          <div className="bg-dark-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaHistory className="text-primary-400" />
                Recent searches
              </div>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => applyQuickSearch(item)}
                  className="px-3 py-2 rounded-full bg-dark-300 text-sm text-gray-200 hover:bg-dark-100 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-dark-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
            <FaFire className="text-orange-400" />
            Quick picks
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => applyQuickSearch(item)}
                className="px-3 py-2 rounded-full bg-primary-500/10 text-primary-300 hover:bg-primary-500 hover:text-white transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

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
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <select
                className="input"
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mood</label>
              <select
                className="input"
                value={filters.mood}
                onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
              >
                <option value="">All Moods</option>
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                className="input"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

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
            onClick={() => runSearch(query)}
            className="btn-primary w-full mt-4"
          >
            Apply Filters
          </button>
        </div>
      )}

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
          <p className="text-gray-500">Use filters, quick picks, or recent searches to discover new songs</p>
        </div>
      )}
    </div>
  );
}
