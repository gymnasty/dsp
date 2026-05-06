import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <Link
          to="/items"
          className="group bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center w-full"
        >
          <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] mb-8 flex items-center justify-center text-7xl group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 shadow-inner border border-slate-100">
            📦
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">{t('menu.items')}</h2>
        </Link>

        <Link
          to="/simulator"
          className="group bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center w-full"
        >
          <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] mb-8 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 shadow-inner border border-slate-100">
            <Calculator size={80} className="text-blue-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">{t('menu.simulator')}</h2>
        </Link>
      </div>
    </div>
  );
};
