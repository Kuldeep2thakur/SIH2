const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 my-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Error</h3>
                    <p className="text-red-700">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
