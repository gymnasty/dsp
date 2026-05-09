import { Calculator, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Link
          to="/items"
          className="group bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-center text-center w-full"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-3xl mb-6 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 shadow-inner border border-slate-100">
            <Package className="w-12 h-12 md:w-14 md:h-14 text-blue-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">{t('menu.items')}</h2>
        </Link>

        <Link
          to="/simulator"
          className="group bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-center text-center w-full"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-3xl mb-6 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 shadow-inner border border-slate-100">
            <Calculator className="w-12 h-12 md:w-14 md:h-14 text-blue-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">{t('menu.simulator')}</h2>
        </Link>
      </div>
    </div>
  );
};
