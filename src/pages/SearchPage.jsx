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
    const [selectedSystem, setSelectedSystem] = useState('All');
    const [showSystemDropdown, setShowSystemDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();
    const resultsRef = useRef(null);
    const searchContainerRef = useRef(null);
    const systemDropdownRef = useRef(null);

    // URLs for the different systems
    const SYSTEMS = [
        { name: 'Ayurveda', url: 'http://sih.gov.in/fhir/ValueSet/namaste-ayurveda', color: 'teal' },
        { name: 'Siddha', url: 'http://sih.gov.in/fhir/ValueSet/namaste-siddha', color: 'orange' },
        { name: 'Unani', url: 'http://sih.gov.in/fhir/ValueSet/namaste-unani', color: 'purple' }
    ];

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
            if (systemDropdownRef.current && !systemDropdownRef.current.contains(event.target)) {
                setShowSystemDropdown(false);
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
                    const systemsToSearch = selectedSystem === 'All' ? SYSTEMS : SYSTEMS.filter(s => s.name === selectedSystem);
                    const promises = systemsToSearch.map(sys =>
                        fetch(`https://symbiomed.onrender.com/fhir/ValueSet/$expand?url=${sys.url}&filter=${encodeURIComponent(searchTerm)}`)
                            .then(res => res.ok ? res.json() : null)
                            .catch(() => null)
                    );

                    const responses = await Promise.all(promises);
                    let allSuggestions = [];

                    responses.forEach((data, index) => {
                        if (data && data.expansion && data.expansion.contains) {
                            // Add system info to each suggestion
                            const items = data.expansion.contains.map(item => ({
                                ...item,
                                systemName: selectedSystem === 'All' ? SYSTEMS[index].name : selectedSystem,
                                systemUrl: selectedSystem === 'All' ? SYSTEMS[index].url : systemsToSearch[index].url,
                                codeSystemUrl: `http://sih.gov.in/fhir/CodeSystem/namaste-${(selectedSystem === 'All' ? SYSTEMS[index].name : selectedSystem).toLowerCase()}`,
                                color: selectedSystem === 'All' ? SYSTEMS[index].color : systemsToSearch[index].color
                            }));
                            allSuggestions = [...allSuggestions, ...items];
                        }
                    });

                    // Deduplicate by code (just in case)
                    const uniqueSuggestions = Array.from(new Map(allSuggestions.map(item => [item.code, item])).values());

                    setSuggestions(uniqueSuggestions.slice(0, 10)); // Limit to 10 mixed suggestions
                    setShowSuggestions(uniqueSuggestions.length > 0);
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
            // Fetch from selected systems
            const systemsToSearch = selectedSystem === 'All' ? SYSTEMS : SYSTEMS.filter(s => s.name === selectedSystem);
            const promises = systemsToSearch.map(sys =>
                fetch(`https://symbiomed.onrender.com/fhir/ValueSet/$expand?url=${sys.url}&filter=${encodeURIComponent(searchTerm)}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(err => {
                        console.error(`Failed to fetch ${sys.name}:`, err);
                        return null;
                    })
            );

            const responses = await Promise.all(promises);
            let combinedResults = [];
            let errorCount = 0;

            responses.forEach((data, index) => {
                if (data && data.expansion && data.expansion.contains) {
                    const items = data.expansion.contains.map(item => ({
                        ...item,
                        systemName: selectedSystem === 'All' ? SYSTEMS[index].name : selectedSystem,
                        systemUrl: selectedSystem === 'All' ? SYSTEMS[index].url : systemsToSearch[index].url,
                        codeSystemUrl: `http://sih.gov.in/fhir/CodeSystem/namaste-${(selectedSystem === 'All' ? SYSTEMS[index].name : selectedSystem).toLowerCase()}`,
                        color: selectedSystem === 'All' ? SYSTEMS[index].color : systemsToSearch[index].color
                    }));
                    combinedResults = [...combinedResults, ...items];
                } else if (!data) {
                    errorCount++;
                }
            });

            if (errorCount === systemsToSearch.length) {
                throw new Error('Failed to fetch results from any system');
            }

            setResults(combinedResults);

        } catch (err) {
            setError(err.message || 'Failed to fetch search results');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTermClick = (item) => {
        // Pass the code AND the specific system it belongs to
        navigate(`/mapping/${encodeURIComponent(item.code)}?system=${encodeURIComponent(item.codeSystemUrl)}`);
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
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* System Selector */}
                            <div className="relative md:w-56 shrink-0 z-20" ref={systemDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowSystemDropdown(!showSystemDropdown)}
                                    className={`w-full h-[56px] px-4 rounded-xl flex items-center justify-between transition-all duration-300 border-2 outline-none focus:ring-4 ${selectedSystem === 'Siddha'
                                        ? 'bg-orange-50 border-orange-200 text-orange-800 hover:border-orange-300 focus:ring-orange-500/10'
                                        : selectedSystem === 'Unani'
                                            ? 'bg-purple-50 border-purple-200 text-purple-800 hover:border-purple-300 focus:ring-purple-500/10'
                                            : selectedSystem === 'Ayurveda'
                                                ? 'bg-teal-50 border-teal-200 text-teal-800 hover:border-teal-300 focus:ring-teal-500/10'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 focus:ring-slate-500/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${selectedSystem === 'Siddha' ? 'bg-orange-500' :
                                            selectedSystem === 'Unani' ? 'bg-purple-500' :
                                                selectedSystem === 'Ayurveda' ? 'bg-teal-500' : 'bg-slate-400'
                                            }`}></span>
                                        <span className="font-bold text-sm">{selectedSystem === 'All' ? 'All Systems' : selectedSystem}</span>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${showSystemDropdown ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showSystemDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                        {['All', 'Ayurveda', 'Siddha', 'Unani'].map((sys) => (
                                            <button
                                                key={sys}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSystem(sys);
                                                    setShowSystemDropdown(false);
                                                }}
                                                className={`w-full px-4 py-3 text-left font-semibold transition-colors flex items-center justify-between group
                                                    ${selectedSystem === sys ? 'bg-slate-50' : 'hover:bg-slate-50'}
                                                `}
                                            >
                                                <span className={`${sys === 'Siddha' ? 'text-orange-600' :
                                                    sys === 'Unani' ? 'text-purple-600' :
                                                        sys === 'Ayurveda' ? 'text-teal-600' : 'text-slate-600'
                                                    } ${selectedSystem === sys ? 'font-bold' : ''}`}>
                                                    {sys === 'All' ? 'All Systems' : sys}
                                                </span>
                                                {selectedSystem === sys && (
                                                    <svg className={`w-5 h-5 ${sys === 'Siddha' ? 'text-orange-500' :
                                                        sys === 'Unani' ? 'text-purple-500' :
                                                            sys === 'Ayurveda' ? 'text-teal-500' : 'text-slate-500'
                                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Input Container */}
                            <div className="relative flex-1" ref={searchContainerRef}>
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
                                    placeholder={`Search ${selectedSystem === 'All' ? 'NAMASTE' : selectedSystem} terminology...`}
                                    className={`input-field w-full transition-all duration-300 focus:border-${selectedSystem === 'Siddha' ? 'orange' : selectedSystem === 'Unani' ? 'purple' : 'teal'}-400`}
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
                                                            handleTermClick(suggestion);
                                                        }}
                                                        className={`px-4 py-3 hover:bg-${suggestion.color === 'teal' ? 'teal' : suggestion.color === 'orange' ? 'orange' : 'purple'}-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors duration-150`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-slate-700">{suggestion.display}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-${suggestion.color === 'teal' ? 'teal' : suggestion.color === 'orange' ? 'orange' : 'purple'}-700 bg-${suggestion.color === 'teal' ? 'teal' : suggestion.color === 'orange' ? 'orange' : 'purple'}-100`}>
                                                                    {suggestion.systemName}
                                                                </span>
                                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-mono">
                                                                    {suggestion.code}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                )}
                            </div>
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
                                onClick={() => handleTermClick(item)}
                                className={`card p-6 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:border-${item.color === 'teal' ? 'teal' : item.color === 'orange' ? 'orange' : 'purple'}-300`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex flex-col gap-1">
                                        <span className={`badge badge-${item.color === 'teal' ? 'cyan' : item.color === 'orange' ? 'orange' : 'purple'} font-mono font-bold text-base w-fit`}>
                                            {item.code}
                                        </span>
                                        <span className={`text-xs font-bold uppercase tracking-wider text-${item.color === 'teal' ? 'teal' : item.color === 'orange' ? 'orange' : 'purple'}-600`}>
                                            {item.systemName}
                                        </span>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-slate-400 group-hover:text-${item.color === 'teal' ? 'teal' : item.color === 'orange' ? 'orange' : 'purple'}-600 transition-colors duration-200`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h3 className={`text-lg font-semibold text-slate-800 mb-2 group-hover:text-${item.color === 'teal' ? 'teal' : item.color === 'orange' ? 'orange' : 'purple'}-700 transition-colors duration-200`}>
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


        </div>
    );
};

export default SearchPage;
