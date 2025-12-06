const ApiCard = ({ title, description, children, icon }) => {
    return (
        <div className="card p-6 card-hover">
            <div className="flex items-start space-x-4 mb-4">
                {icon && (
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                    {description && (
                        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
                    )}
                </div>
            </div>
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
};

export default ApiCard;
