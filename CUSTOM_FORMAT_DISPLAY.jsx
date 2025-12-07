const CustomFormatDisplay = ({ mappingData }) => {
    return (
        <>
            {/* Custom format check - add this after line 175 in ApiCard for mapping display */}
            {/* Check for custom API format (result array) */}
            {
                mappingData && mappingData.result && mappingData.result.length > 0 ? (
                    <div className="space-y-4">
                        <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 mb-4">
                            <p className="text-teal-800 font-semibold">
                                Found {mappingData.resultCount} ICD-11 TM2 {mappingData.resultCount === 1 ? 'Mapping' : 'Mappings'}
                            </p>
                        </div>

                        {mappingData.result.map((mapping, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 rounded-xl border-2 border-teal-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="badge badge-teal text-base font-bold uppercase">
                                        {mapping.equivalence || 'EQUIVALENT'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-teal-700 font-semibold">
                                            Confidence: {(mapping.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-teal-700 font-semibold">TM2 Code</p>
                                        <p className="text-xl font-bold text-teal-900 font-mono">{mapping.code}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-teal-700 font-semibold">Display Name</p>
                                        <p className="text-lg text-teal-900">{mapping.display}</p>
                                    </div>

                                    {mapping.definition && (
                                        <div>
                                            <p className="text-sm text-teal-700 font-semibold">Definition</p>
                                            <p className="text-sm text-teal-800 leading-relaxed">{mapping.definition}</p>
                                        </div>
                                    )}

                                    {mapping.comment && (
                                        <div className="mt-2 p-2 bg-teal-100 rounded-lg">
                                            <p className="text-xs text-teal-700 italic">{mapping.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : mappingData && mappingData.parameter ? (
                    // Standard FHIR format display (keep existing code)
                    <div className="text-slate-500 italic">Standard FHIR Parameter format...</div>
                ) : null
            }
        </>
    );
};

export default CustomFormatDisplay;
