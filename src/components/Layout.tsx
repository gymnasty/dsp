import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Layout = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ja') ? 'en' : 'ja';
    i18n.changeLanguage(newLang);
  };

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
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              {i18n.language.startsWith('ja') ? 'EN' : '日本語'}
            </button>
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
