import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import ApiCard from '../components/ApiCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();
    const resultsRef = useRef(null);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        if (!loading && results.length > 0 && resultsRef.current) {
            // Scroll to results with offset for header
            const yOffset = -150;
            const element = resultsRef.current;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            gsap.fromTo(
                resultsRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [results, loading]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounced search for suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setSuggestionsLoading(true);
                try {
                    const url = `https://symbiomed.onrender.com/fhir/ValueSet/$expand?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&filter=${encodeURIComponent(searchTerm)}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.expansion && data.expansion.contains) {
                            setSuggestions(data.expansion.contains.slice(0, 5)); // Limit to 5 suggestions
                            setShowSuggestions(true);
                        } else {
                            setSuggestions([]);
                            setShowSuggestions(false);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                    setSuggestions([]);
                } finally {
                    setSuggestionsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const url = `https://symbiomed.onrender.com/fhir/ValueSet/$expand?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&filter=${encodeURIComponent(searchTerm)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Extract concepts from the expansion
            if (data.expansion && data.expansion.contains) {
                setResults(data.expansion.contains);
            } else {
                setResults([]);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch search results');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTermClick = (code) => {
        // URL encode the code to handle special characters
        navigate(`/mapping/${encodeURIComponent(code)}`);
    };

    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="text-center mb-12">

                <h1 className="section-title text-gradient mb-4">
                    Unified Search
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Search for NAMASTE and Ayurveda medical terms. Click any term to view its mapping to international standards.
                </p>
            </div>

            {/* Search Card */}
            <div className="max-w-4xl mx-auto mb-12">
                <ApiCard
                    title="Search NAMASTE / Ayurveda Terms"
                    description="Enter a term or keyword to search the NAMASTE Ayurveda terminology system. The search will return matching codes and their display names."
                >
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative" ref={searchContainerRef}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value.trim().length === 0) {
                                        setShowSuggestions(false);
                                    }
                                }}
                                onFocus={() => {
                                    if (suggestions.length > 0) setShowSuggestions(true);
                                }}
                                placeholder="Type a medical term (e.g., 'dosha', 'vata', 'pitta')..."
                                className="input-field w-full"
                                autoFocus
                                autoComplete="off"
                            />

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                                    {suggestionsLoading ? (
                                        <div className="p-4 text-center text-slate-500 text-sm">
                                            Loading suggestions...
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <ul>
                                            {suggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSearchTerm(suggestion.display || suggestion.code);
                                                        setShowSuggestions(false);
                                                        handleTermClick(suggestion.code);
                                                    }}
                                                    className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors duration-150"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-slate-700">{suggestion.display}</span>
                                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-mono">
                                                            {suggestion.code}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchTerm.trim()}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Searching...
                                </span>
                            ) : (
                                'Search Terminology'
                            )}
                        </button>
                    </form>

                    {/* API Info */}
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-sm text-teal-800 font-mono">
                            <strong>Endpoint:</strong> GET /fhir/ValueSet/$expand
                        </p>
                        <p className="text-sm text-teal-700 mt-1">
                            This operation expands the ValueSet and filters results based on your search term.
                        </p>
                    </div>
                </ApiCard>
            </div>

            {/* Results Section */}
            {loading && <Loading message="Searching terminology database..." />}

            {error && <ErrorMessage message={error} onRetry={handleSearch} />}

            {!loading && hasSearched && results.length === 0 && !error && (
                <div className="text-center py-12">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-slate-400 border-dashed rounded-full"></div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">No Results Found</h3>
                    <p className="text-slate-600">Try a different search term or keyword.</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Found {results.length} {results.length === 1 ? 'Result' : 'Results'}
                        </h2>
                        <span className="badge badge-teal text-base px-4 py-2">
                            {searchTerm}
                        </span>
                    </div>

                    <div ref={resultsRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((item, index) => (
                            <div
                                key={`${item.code}-${index}`}
                                onClick={() => handleTermClick(item.code)}
                                className="card p-6 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:border-teal-300"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="badge badge-cyan font-mono font-bold text-base">
                                        {item.code}
                                    </span>
                                    <svg
                                        className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors duration-200">
                                    {item.display}
                                </h3>
                                {item.system && (
                                    <p className="text-xs text-slate-500 font-mono truncate" title={item.system}>
                                        {item.system}
                                    </p>
                                )}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button className="text-teal-600 font-medium text-sm group-hover:text-teal-700 flex items-center">
                                        View Mapping
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="max-w-4xl mx-auto mt-12">
                <div className="glass-card p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">💡 How It Works</h3>
                    <div className="space-y-3 text-slate-700">
                        <p className="flex items-start">
                            <span className="text-teal-600 font-bold mr-3 text-xl">1.</span>
                            <span>Enter a medical term related to Ayurveda or traditional medicine</span>
                        </p>
                        <p className="flex items-start">
                            <span className="text-teal-600 font-bold mr-3 text-xl">2.</span>
                            <span>The system searches the NAMASTE terminology database</span>
                        </p>
                        <p className="flex items-start">
                            <span className="text-teal-600 font-bold mr-3 text-xl">3.</span>
                            <span>Click any result to see how it maps to international medical standards (ICD-11 TM2)</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
