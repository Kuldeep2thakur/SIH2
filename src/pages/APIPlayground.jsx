import { useState } from 'react';
import ApiCard from '../components/ApiCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const APIPlayground = () => {
    const [activeTab, setActiveTab] = useState('lookup');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    // Lookup state
    const [lookupSystem, setLookupSystem] = useState('http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda');
    const [lookupCode, setLookupCode] = useState('');

    // Translate state
    const [translateCode, setTranslateCode] = useState('');

    // Validate Code state
    const [validateUrl, setValidateUrl] = useState('http://sih.gov.in/fhir/ValueSet/namaste-ayurveda');
    const [validateSystem, setValidateSystem] = useState('http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda');
    const [validateCode, setValidateCode] = useState('');

    // Bundle Upload state
    const [bundleJson, setBundleJson] = useState('');

    const handleLookup = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const url = `https://symbiomed.onrender.com/fhir/CodeSystem/$lookup?system=${encodeURIComponent(lookupSystem)}&code=${encodeURIComponent(lookupCode)}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const url = `https://symbiomed.onrender.com/fhir/ConceptMap/$translate?url=urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING&system=urn:namaste&target=http://id.who.int/icd/entity&code=${encodeURIComponent(translateCode)}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleValidateCodeGet = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const url = `https://symbiomed.onrender.com/fhir/ValueSet/$validate-code?url=${encodeURIComponent(validateUrl)}&system=${encodeURIComponent(validateSystem)}&code=${encodeURIComponent(validateCode)}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleValidateCodePost = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const payload = {
                url: validateUrl,
                system: validateSystem,
                code: validateCode,
            };

            const url = 'https://symbiomed.onrender.com/fhir/ValueSet/$validate-code';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGetBundle = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const url = 'https://symbiomed.onrender.com/fhir/bundle';
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadBundle = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const payload = JSON.parse(bundleJson);

            const url = 'https://symbiomed.onrender.com/fhir/bundle/upload';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message || 'Invalid JSON or network error');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'lookup', label: '$lookup', icon: '🔍' },
        { id: 'translate', label: '$translate', icon: '🔗' },
        { id: 'validate', label: '$validate-code', icon: '✓' },
        { id: 'bundle', label: 'Bundle', icon: '📦' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-8">
                <h1 className="section-title text-gradient">
                    🧪 API Playground
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    Test all SymbioMed API endpoints interactively
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setError(null);
                            setResponse(null);
                        }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Card */}
                <div>
                    {activeTab === 'lookup' && (
                        <ApiCard
                            title="CodeSystem $lookup"
                            description="Look up a code in a code system to retrieve its details"
                            icon="🔍"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        System URL
                                    </label>
                                    <input
                                        type="text"
                                        value={lookupSystem}
                                        onChange={(e) => setLookupSystem(e.target.value)}
                                        className="input-field"
                                        placeholder="http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        value={lookupCode}
                                        onChange={(e) => setLookupCode(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., AA"
                                    />
                                </div>
                                <button
                                    onClick={handleLookup}
                                    disabled={loading || !lookupCode}
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Loading...' : '🔍 Lookup Code'}
                                </button>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs font-mono text-blue-800">
                                    GET /fhir/CodeSystem/$lookup
                                </div>
                            </div>
                        </ApiCard>
                    )}

                    {activeTab === 'translate' && (
                        <ApiCard
                            title="ConceptMap $translate"
                            description="Translate a code from one system to another using a ConceptMap"
                            icon="🔗"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        NAMASTE Code
                                    </label>
                                    <input
                                        type="text"
                                        value={translateCode}
                                        onChange={(e) => setTranslateCode(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., AA"
                                    />
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                    <p className="font-semibold text-slate-700 mb-1">Fixed Parameters:</p>
                                    <p className="text-xs text-slate-600 font-mono">URL: urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING</p>
                                    <p className="text-xs text-slate-600 font-mono">System: urn:namaste</p>
                                    <p className="text-xs text-slate-600 font-mono">Target: http://id.who.int/icd/entity</p>
                                </div>
                                <button
                                    onClick={handleTranslate}
                                    disabled={loading || !translateCode}
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Loading...' : '🔗 Translate Code'}
                                </button>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs font-mono text-blue-800">
                                    GET /fhir/ConceptMap/$translate
                                </div>
                            </div>
                        </ApiCard>
                    )}

                    {activeTab === 'validate' && (
                        <ApiCard
                            title="ValueSet $validate-code"
                            description="Validate whether a code is in a value set"
                            icon="✓"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        ValueSet URL
                                    </label>
                                    <input
                                        type="text"
                                        value={validateUrl}
                                        onChange={(e) => setValidateUrl(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        System
                                    </label>
                                    <input
                                        type="text"
                                        value={validateSystem}
                                        onChange={(e) => setValidateSystem(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        value={validateCode}
                                        onChange={(e) => setValidateCode(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., AA"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={handleValidateCodeGet}
                                        disabled={loading || !validateCode}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Loading...' : 'GET Request'}
                                    </button>
                                    <button
                                        onClick={handleValidateCodePost}
                                        disabled={loading || !validateCode}
                                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Loading...' : 'POST Request'}
                                    </button>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs font-mono text-blue-800">
                                    GET/POST /fhir/ValueSet/$validate-code
                                </div>
                            </div>
                        </ApiCard>
                    )}

                    {activeTab === 'bundle' && (
                        <ApiCard
                            title="FHIR Bundle Operations"
                            description="Retrieve or upload FHIR bundles"
                            icon="📦"
                        >
                            <div className="space-y-4">
                                <button
                                    onClick={handleGetBundle}
                                    disabled={loading}
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Loading...' : '📥 Get Bundle'}
                                </button>

                                <div className="border-t-2 border-slate-200 pt-4">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Upload Bundle (JSON)
                                    </label>
                                    <textarea
                                        value={bundleJson}
                                        onChange={(e) => setBundleJson(e.target.value)}
                                        className="input-field font-mono text-sm"
                                        rows={10}
                                        placeholder='{"resourceType": "Bundle", ...}'
                                    />
                                    <button
                                        onClick={handleUploadBundle}
                                        disabled={loading || !bundleJson}
                                        className="btn-secondary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Uploading...' : '📤 Upload Bundle'}
                                    </button>
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs font-mono text-blue-800">
                                    GET /fhir/bundle<br />
                                    POST /fhir/bundle/upload
                                </div>
                            </div>
                        </ApiCard>
                    )}
                </div>

                {/* Response Card */}
                <div>
                    <ApiCard
                        title="API Response"
                        description="JSON response from the server"
                        icon="📄"
                    >
                        {loading && <Loading message="Calling API..." />}

                        {error && <ErrorMessage message={error} />}

                        {response && (
                            <div>
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 font-semibold">✓ Success</p>
                                </div>
                                <pre className="code-block max-h-[600px] overflow-y-auto text-xs">
                                    {JSON.stringify(response, null, 2)}
                                </pre>
                            </div>
                        )}

                        {!loading && !error && !response && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🧪</div>
                                <p className="text-slate-600">
                                    Select an endpoint and make a request to see the response here
                                </p>
                            </div>
                        )}
                    </ApiCard>
                </div>
            </div>

            {/* Health Check */}
            <div className="mt-8 max-w-4xl mx-auto">
                <ApiCard
                    title="🏥 Health Check"
                    description="Check if the API server is running"
                    icon="❤️"
                >
                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await fetch('https://symbiomed.onrender.com/health');
                                const data = await res.json();
                                setResponse(data);
                                setError(null);
                            } catch (err) {
                                setError('Health check failed');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="btn-primary w-full"
                    >
                        🏥 Check API Health
                    </button>
                </ApiCard>
            </div>
        </div>
    );
};

export default APIPlayground;
