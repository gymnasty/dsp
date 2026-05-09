import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Menu, X as CloseIcon } from 'lucide-react';

export const Layout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  const currentLanguage = languages.find(lang => i18n.language.startsWith(lang.code)) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        // Only close if the click wasn't on the toggle button (handled by its own onClick)
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        if (toggleBtn && !toggleBtn.contains(event.target as Node)) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">D</div>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              <span className="md:hidden">DSP <span className="text-blue-600">Tools</span></span>
              <span className="hidden md:inline">Dyson Sphere Program <span className="text-blue-600">Tools</span></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/items" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              {t('menu.items')}
            </Link>
            <Link to="/simulator" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              {t('menu.simulator')}
            </Link>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
              >
                <Globe size={14} className="text-slate-400" />
                <span>{currentLanguage.label}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                        i18n.language.startsWith(lang.code) 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden bg-white border-b border-slate-200 shadow-xl py-4 px-4 space-y-4 animate-in slide-in-from-top duration-300"
          >
            <nav className="flex flex-col gap-2">
              <Link 
                to="/items" 
                className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                {t('menu.items')}
              </Link>
              <Link 
                to="/simulator" 
                className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                {t('menu.simulator')}
              </Link>
            </nav>
            <div className="pt-4 border-t border-slate-100">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('menu.language')}</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                      i18n.language.startsWith(lang.code) 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="container mx-auto px-4 py-6 md:py-8 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            Dyson Sphere Program Tools &copy; 2026
          </p>
        </div>
      </footer>
    </div>
  );
};
