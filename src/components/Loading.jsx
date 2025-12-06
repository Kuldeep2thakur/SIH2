const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="loading-spinner mb-4"></div>
            <p className="text-slate-600 text-lg font-medium">{message}</p>
        </div>
    );
};

export default Loading;
