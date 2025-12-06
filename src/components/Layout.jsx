import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Animate page transitions
        gsap.fromTo(
            '.page-content',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        // Close mobile menu on route change
        setIsMobileMenuOpen(false);
    }, [location]);

    const navItems = [
        { path: '/', label: 'Unified Search', icon: '🔍' },
        { path: '/fhir-builder', label: 'FHIR Builder', icon: '📝' },
        { path: '/api-playground', label: 'API Playground', icon: '🧪' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="bg-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                                    <img
                                        src="/WhatsApp Image 2025-09-23 at 15.12.01_7162a348.jpg"
                                        alt="SymbioMed Logo"
                                        className="w-12 h-12 object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-slate-800 font-display tracking-tight">
                                        SYMBIOMED
                                    </span>
                                    <span className="text-[0.65rem] uppercase tracking-wider font-bold text-blue-600">
                                        Terminology Service
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${isActive
                                            ? 'text-blue-700 bg-blue-50'
                                            : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="flex items-center space-x-2">
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200 shadow-lg absolute w-full left-0 z-50">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <span className="flex items-center space-x-3">
                                            <span className="text-xl">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1 page-content relative">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-3">
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <span className="text-xl">🏥</span>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm font-bold text-slate-900">SymbioMed Terminology Service</p>
                                <p className="text-xs text-slate-500">Smart India Hackathon 2024 Solution</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Documentation</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">API Status</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Support</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
