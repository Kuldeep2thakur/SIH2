const ApiCard = ({ title, description, children }) => {
    return (
        <div className="card p-8 card-hover">
            <div className="mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                    {title}
                </h3>
                {description && (
                    <p className="text-slate-500 text-base leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default ApiCard;
