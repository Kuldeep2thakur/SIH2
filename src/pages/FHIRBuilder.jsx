import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiCard from '../components/ApiCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const FHIRBuilder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const passedData = location.state || {};

    const [formData, setFormData] = useState({
        ayushCode: passedData.code || '',
        ayushSystem: 'http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda',
        clinicalStatus: 'active',
        verificationStatus: 'confirmed',
        encounterClass: 'AMB',
        onsetDate: new Date().toISOString().split('T')[0],
    });

    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [validationResponse, setValidationResponse] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const payload = {
                ayushCode: formData.ayushCode,
                ayushSystem: formData.ayushSystem,
                clinicalStatus: formData.clinicalStatus,
                verificationStatus: formData.verificationStatus,
                encounterClass: formData.encounterClass,
                onsetDate: formData.onsetDate,
            };

            const url = 'https://symbiomed.onrender.com/fhir/ingest/problem-list';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message || 'Failed to create FHIR Condition');
        } finally {
            setLoading(false);
        }
    };

    const handleValidateDualCoding = async () => {
        setValidating(true);
        setError(null);
        setValidationResponse(null);

        try {
            const payload = {
                ayushCode: formData.ayushCode,
                ayushSystem: formData.ayushSystem,
            };

            const url = 'https://symbiomed.onrender.com/fhir/validate/dual-code';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Validation Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setValidationResponse(data);
        } catch (err) {
            setError(err.message || 'Failed to validate dual coding');
        } finally {
            setValidating(false);
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-8">
                <h1 className="section-title text-gradient">
                    📝 FHIR Condition Builder
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    Create a FHIR Condition resource (Problem List Entry) with AYUSH terminology
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Form Card */}
                <div>
                    <ApiCard
                        title="Problem List Entry Form"
                        description="Fill in the details to create a FHIR Condition resource"
                        icon="📋"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    AYUSH Code *
                                </label>
                                <input
                                    type="text"
                                    name="ayushCode"
                                    value={formData.ayushCode}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="e.g., AA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    AYUSH System *
                                </label>
                                <input
                                    type="text"
                                    name="ayushSystem"
                                    value={formData.ayushSystem}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Clinical Status *
                                </label>
                                <select
                                    name="clinicalStatus"
                                    value={formData.clinicalStatus}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="active">Active</option>
                                    <option value="recurrence">Recurrence</option>
                                    <option value="relapse">Relapse</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="remission">Remission</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Verification Status *
                                </label>
                                <select
                                    name="verificationStatus"
                                    value={formData.verificationStatus}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="unconfirmed">Unconfirmed</option>
                                    <option value="provisional">Provisional</option>
                                    <option value="differential">Differential</option>
                                    <option value="refuted">Refuted</option>
                                    <option value="entered-in-error">Entered in Error</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Encounter Class *
                                </label>
                                <select
                                    name="encounterClass"
                                    value={formData.encounterClass}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="AMB">Ambulatory</option>
                                    <option value="EMER">Emergency</option>
                                    <option value="IMP">Inpatient</option>
                                    <option value="HH">Home Health</option>
                                    <option value="VR">Virtual</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Onset Date *
                                </label>
                                <input
                                    type="date"
                                    name="onsetDate"
                                    value={formData.onsetDate}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating...
                                    </span>
                                ) : (
                                    '📤 Create FHIR Condition'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleValidateDualCoding}
                                disabled={validating || !formData.ayushCode}
                                className="btn-secondary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {validating ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Validating...
                                    </span>
                                ) : (
                                    '✓ Validate Dual Coding'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 font-mono mb-1">
                                <strong>Endpoints:</strong>
                            </p>
                            <p className="text-xs text-blue-700 font-mono">POST /fhir/ingest/problem-list</p>
                            <p className="text-xs text-blue-700 font-mono">POST /fhir/validate/dual-code</p>
                        </div>
                    </ApiCard>
                </div>

                {/* Response Card */}
                <div className="space-y-6">
                    {error && <ErrorMessage message={error} />}

                    {response && (
                        <ApiCard
                            title="✅ FHIR Condition Created"
                            description="Successfully created FHIR Condition resource"
                            icon="✅"
                        >
                            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 mb-4">
                                <p className="text-green-800 font-semibold text-lg">
                                    ✓ Resource created successfully!
                                </p>
                            </div>
                            <pre className="code-block max-h-96 overflow-y-auto">
                                {JSON.stringify(response, null, 2)}
                            </pre>
                        </ApiCard>
                    )}

                    {validationResponse && (
                        <ApiCard
                            title="✅ Dual Coding Validation"
                            description="Validation result from the server"
                            icon="✓"
                        >
                            <div className={`p-4 rounded-xl border-2 mb-4 ${validationResponse.isValid
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                <p className={`font-semibold text-lg ${validationResponse.isValid ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {validationResponse.isValid ? '✓ Valid dual coding' : '✗ Invalid dual coding'}
                                </p>
                            </div>
                            <pre className="code-block max-h-96 overflow-y-auto">
                                {JSON.stringify(validationResponse, null, 2)}
                            </pre>
                        </ApiCard>
                    )}

                    {!response && !validationResponse && !error && (
                        <div className="card p-8 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">
                                Ready to Create
                            </h3>
                            <p className="text-slate-600">
                                Fill in the form and submit to create a FHIR Condition resource
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-12 max-w-4xl mx-auto">
                <div className="glass-card p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">💡 About Problem List Entries</h3>
                    <div className="space-y-3 text-slate-700">
                        <p className="flex items-start">
                            <span className="text-primary-600 font-bold mr-3 text-xl">•</span>
                            <span><strong>Problem List Entry:</strong> A FHIR Condition resource that represents a clinical problem or diagnosis recorded in a patient's medical record.</span>
                        </p>
                        <p className="flex items-start">
                            <span className="text-primary-600 font-bold mr-3 text-xl">•</span>
                            <span><strong>Dual Coding:</strong> Using both traditional AYUSH terminology and international codes (ICD-11) for interoperability.</span>
                        </p>
                        <p className="flex items-start">
                            <span className="text-primary-600 font-bold mr-3 text-xl">•</span>
                            <span><strong>Clinical Status:</strong> Indicates whether the condition is currently active or has been resolved.</span>
                        </p>
                        <p className="flex items-start">
                            <span className="text-primary-600 font-bold mr-3 text-xl">•</span>
                            <span><strong>Verification Status:</strong> The verification/validation status to support diagnostic accuracy.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FHIRBuilder;
