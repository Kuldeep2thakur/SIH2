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
        { path: '/', label: 'Unified Search' },
        { path: '/fhir-builder', label: 'FHIR Builder' },
        { path: '/api-playground', label: 'API Playground' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Premium Navbar with Gradient */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-4 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
                                    <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 p-2.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-teal-200/50">
                                        <img
                                            src="/WhatsApp Image 2025-09-23 at 15.12.01_7162a348.jpg"
                                            alt="SymbioMed Logo"
                                            className="w-11 h-11 object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-900 bg-clip-text text-transparent font-display tracking-tight">
                                        SYMBIOMED
                                    </span>
                                    <span className="text-[0.65rem] uppercase tracking-wider font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                        Terminology Service
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25'
                                            : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                                            }`}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full"></div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2.5 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-700 focus:outline-none transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-lg">
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`block px-5 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25'
                                            : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                                            }`}
                                    >
                                        {item.label}
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
        </div>
    );
};

export default Layout;
