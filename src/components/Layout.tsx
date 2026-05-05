import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export const Layout = () => {
  const { t, i18n } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  const currentLanguage = languages.find(lang => i18n.language.startsWith(lang.code)) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Dyson Sphere Program <span className="text-blue-600">Tools</span>
            </span>
          </Link>
          <nav className="flex gap-6 items-center">
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
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
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
