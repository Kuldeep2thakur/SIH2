import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ApiCard from '../components/ApiCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const MappingPage = () => {
    const { code: encodedCode } = useParams();
    const navigate = useNavigate();

    // Decode the URL-encoded code to handle special characters
    const code = decodeURIComponent(encodedCode);
    const [searchParams] = useSearchParams();
    const systemParam = searchParams.get('system');
    // Default to Ayurveda if not provided or if literally 'undefined'
    const system = (systemParam && systemParam !== 'undefined') ? decodeURIComponent(systemParam) : 'http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda';

    // Determine pretty name for display
    const getSystemName = (sysUrl) => {
        if (sysUrl.includes('siddha')) return 'Siddha';
        if (sysUrl.includes('unani')) return 'Unani';
        return 'Ayurveda';
    };

    const systemName = getSystemName(system);

    const [codeDetails, setCodeDetails] = useState(null);
    const [mappingData, setMappingData] = useState(null);
    const [selectedMapping, setSelectedMapping] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [code]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch code details using $lookup
            const lookupUrl = `https://symbiomed.onrender.com/fhir/CodeSystem/$lookup?system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}`;
            const lookupResponse = await fetch(lookupUrl);

            if (!lookupResponse.ok) {
                throw new Error(`Lookup failed: ${lookupResponse.status}`);
            }

            const lookupData = await lookupResponse.json();
            setCodeDetails(lookupData);

            // Fetch mapping using $translate
            const translateUrl = `https://symbiomed.onrender.com/fhir/ConceptMap/$translate?url=urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING&system=urn:namaste&target=http://id.who.int/icd/entity&code=${encodeURIComponent(code)}`;
            const translateResponse = await fetch(translateUrl);

            if (!translateResponse.ok) {
                console.warn(`Translation API returned status ${translateResponse.status}: ${translateResponse.statusText}`);
                // Store error info for display
                setMappingData({
                    error: true,
                    status: translateResponse.status,
                    message: `API returned status ${translateResponse.status}`
                });
            } else {
                const translateData = await translateResponse.json();
                console.log('Translate API Response:', translateData); // Debug log

                // Check for custom format (resultCount, result array)
                if (translateData && translateData.resultCount > 0 && translateData.result) {
                    setMappingData(translateData);
                }
                // Check for standard FHIR format (parameter array with match)
                else if (translateData && translateData.parameter && translateData.parameter.some(p => p.name === 'match')) {
                    setMappingData(translateData);
                } else {
                    // No match found, but API call succeeded
                    setMappingData({
                        noMatch: true,
                        message: 'No ICD-11 TM2 mapping exists for this code yet'
                    });
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch mapping data');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFHIR = () => {
        navigate('/fhir-builder', {
            state: {
                code,
                system,
                codeDetails,
                selectedMapping
            }
        });
    };

    if (loading) {
        return (
            <div className="page-container">
                <Loading message="Fetching code details and mappings..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <ErrorMessage message={error} onRetry={fetchData} />
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary mt-6"
                >
                    ← Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-teal-600 hover:text-teal-700 font-medium mb-4 flex items-center group"
                >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Search
                </button>
                <h1 className="section-title text-gradient">
                    NAMASTE to TM2 Mapping
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    View detailed code information and international standard mappings
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Code Details Card */}
                <ApiCard
                    title="NAMASTE Code Details"
                    description="Information from the NAMASTE Ayurveda code system"
                >
                    {codeDetails && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
                                <p className="text-sm text-cyan-700 font-semibold mb-1">Code</p>
                                <p className="text-2xl font-bold text-cyan-900 font-mono">{code}</p>
                            </div>

                            {codeDetails.parameter && codeDetails.parameter.map((param, idx) => {
                                if (param.name === 'display') {
                                    return (
                                        <div key={idx} className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                                            <p className="text-sm text-teal-700 font-semibold mb-1">Display Name</p>
                                            <p className="text-lg font-semibold text-teal-900">{param.valueString}</p>
                                        </div>
                                    );
                                }
                                if (param.name === 'definition') {
                                    return (
                                        <div key={idx} className="bg-green-50 p-4 rounded-xl border border-green-200">
                                            <p className="text-sm text-green-700 font-semibold mb-1">Definition</p>
                                            <p className="text-slate-800">{param.valueString}</p>
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-sm text-slate-600 font-semibold mb-1">System</p>
                                <p className="text-xs font-mono text-slate-700 break-all">
                                    http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda
                                </p>
                            </div>
                        </div>
                    )}


                </ApiCard>

                {/* Mapping Card */}
                <ApiCard
                    title="TM2 Mapping (ICD-11)"
                    description="Translation to WHO International Classification of Diseases"
                >
                    {/* Display custom format with result array */}
                    {mappingData && mappingData.result && mappingData.result.length > 0 ? (
                        <div className="space-y-4">
                            <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 mb-4">
                                <p className="text-teal-800 font-semibold">
                                    Found {mappingData.resultCount} ICD-11 TM2 {mappingData.resultCount === 1 ? 'Mapping' : 'Mappings'}
                                </p>
                            </div>

                            {mappingData.result.map((mapping, idx) => {
                                const isSelected = selectedMapping && selectedMapping.code === mapping.code;
                                return (
                                    <div key={idx} className={`bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl transition-all duration-200 ${isSelected ? 'border-4 border-blue-500 shadow-lg' : 'border-2 border-green-200'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="badge badge-green text-base font-bold uppercase">
                                                {mapping.equivalence || 'EQUIVALENT'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-green-700 font-semibold">
                                                    Confidence: {(mapping.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-green-700 font-semibold">TM2 Code</p>
                                                <p className="text-xl font-bold text-green-900 font-mono">{mapping.code}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-green-700 font-semibold">Display Name</p>
                                                <p className="text-lg text-green-900">{mapping.display}</p>
                                            </div>

                                            {mapping.definition && (
                                                <div>
                                                    <p className="text-sm text-green-700 font-semibold">Definition</p>
                                                    <p className="text-sm text-green-800 leading-relaxed">{mapping.definition}</p>
                                                </div>
                                            )}

                                            {mapping.comment && (
                                                <div className="mt-2 p-2 bg-green-100 rounded-lg">
                                                    <p className="text-xs text-green-700 italic">{mapping.comment}</p>
                                                </div>
                                            )}

                                            {/* Select Button */}
                                            <button
                                                onClick={() => setSelectedMapping(mapping)}
                                                className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${isSelected ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-green-700 border-2 border-green-300 hover:bg-green-50'}`}
                                            >
                                                {isSelected ? 'Selected for Dual Coding' : 'Select this mapping'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : mappingData && mappingData.parameter ? (
                        <div className="space-y-4">
                            {mappingData.parameter.map((param, idx) => {
                                if (param.name === 'match' && param.part) {
                                    const equivalence = param.part.find(p => p.name === 'equivalence')?.valueCode;
                                    const concept = param.part.find(p => p.name === 'concept');

                                    return (
                                        <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="badge badge-green text-base font-bold">
                                                    {equivalence || 'equivalent'}
                                                </span>
                                            </div>

                                            {concept && concept.part && concept.part.map((part, pidx) => (
                                                <div key={pidx} className="mb-2">
                                                    {part.name === 'code' && (
                                                        <div className="mb-2">
                                                            <p className="text-sm text-green-700 font-semibold">TM2 Code</p>
                                                            <p className="text-xl font-bold text-green-900 font-mono">{part.valueCode}</p>
                                                        </div>
                                                    )}
                                                    {part.name === 'display' && (
                                                        <div>
                                                            <p className="text-sm text-green-700 font-semibold">Display</p>
                                                            <p className="text-lg text-green-900">{part.valueString}</p>
                                                        </div>
                                                    )}
                                                    {part.name === 'system' && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-green-700 font-semibold">System</p>
                                                            <p className="text-xs font-mono text-green-800 break-all">{part.valueUri}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            {!mappingData.parameter.find(p => p.name === 'match') && (
                                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                                    <p className="text-yellow-800 font-medium">No mapping found for this code</p>
                                </div>
                            )}
                        </div>
                    ) : mappingData?.error ? (
                        <div className="bg-red-50 p-5 rounded-xl border border-red-200">
                            <p className="text-red-800 font-medium">Translation API Error</p>
                            <p className="text-red-700 text-sm mt-2">{mappingData.message}</p>
                            <p className="text-red-600 text-xs mt-3">
                                The ConceptMap $translate endpoint returned an error. The server may be starting up or experiencing issues.
                            </p>
                            <button
                                onClick={fetchData}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : mappingData?.noMatch ? (
                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                            <p className="text-yellow-800 font-medium">No Mapping Found</p>
                            <p className="text-yellow-700 text-sm mt-2">{mappingData.message}</p>
                            <p className="text-yellow-600 text-xs mt-3">
                                This NAMASTE code exists but doesn't have an ICD-11 TM2 mapping in the system yet.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                            <p className="text-yellow-800 font-medium">Mapping data not available</p>
                            <p className="text-yellow-700 text-sm mt-2">This code may not have an ICD-11 TM2 mapping yet, or the API call failed.</p>
                            <button
                                onClick={fetchData}
                                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}


                </ApiCard>
            </div>

            {/* Action Buttons */}
            <div className="max-w-2xl mx-auto">
                <ApiCard
                    title="Next Steps"
                    description="Generate FHIR resources using this terminology"
                >
                    <div className="space-y-3">
                        <button
                            onClick={handleGenerateFHIR}
                            className="btn-primary w-full text-lg py-4"
                        >
                            Generate FHIR Condition Resource
                        </button>
                        <button
                            onClick={() => navigate('/api-playground')}
                            className="btn-secondary w-full text-lg py-4"
                        >
                            Test in API Playground
                        </button>
                    </div>
                </ApiCard>
            </div>

            {/* Raw JSON Display */}
            {(codeDetails || mappingData) && (
                <div className="mt-8">
                    <details className="card p-6">
                        <summary className="cursor-pointer font-bold text-lg text-slate-800 hover:text-teal-600 transition-colors duration-200">
                            View Raw JSON Response
                        </summary>
                        <div className="mt-4 space-y-4">
                            {codeDetails && (
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-2">CodeSystem $lookup Response:</h4>
                                    <pre className="code-block overflow-x-auto">
                                        {JSON.stringify(codeDetails, null, 2)}
                                    </pre>
                                </div>
                            )}
                            {mappingData && (
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-2">ConceptMap $translate Response:</h4>
                                    <pre className="code-block overflow-x-auto">
                                        {JSON.stringify(mappingData, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
};

export default MappingPage;
