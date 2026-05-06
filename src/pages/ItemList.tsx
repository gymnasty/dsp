import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BUILDING_ORDER } from '../data/buildingOrder';
import { ITEMS } from '../data/items';
import { COMPONENT_GRID } from '../data/layouts';
import { CATEGORIES, ITEM_TYPES } from '../types';
import { getItemName } from '../utils/i18n';

export const ItemList = () => {
  const { t } = useTranslation();

  const buildingCategories = [
    CATEGORIES.POWER,
    CATEGORIES.COLLECTION,
    CATEGORIES.LOGISTICS,
    CATEGORIES.STORAGE,
    CATEGORIES.PRODUCTION_BUILDING,
    CATEGORIES.TRANSPORT,
    CATEGORIES.DEFENSE,
    CATEGORIES.COSMO,
    CATEGORIES.ENVIRONMENT
  ];

  const GridTable = ({ grid, title, icon }: { grid: (string | null)[][], title: string, icon: string }) => (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-xl">{icon}</span>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{title}</h2>
      </div>

      <div className="inline-block border border-slate-300 rounded overflow-hidden shadow-sm">
        <div className="bg-white p-1">
          <table className="border-collapse">
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((itemId, colIndex) => {
                    if (itemId === null) {
                      return <td key={`${rowIndex}-${colIndex}`} className="w-12 h-12 border border-slate-100 bg-slate-50/50"></td>;
                    }
                    
                    const item = Object.values(ITEMS).find(i => i.id === itemId);
                    const name = getItemName(item);
                    
                    return (
                      <td key={`${rowIndex}-${colIndex}`} className="p-0 border border-slate-200">
                        <Link
                          to={item ? `/item/${item.id}` : '#'}
                          className="group relative block w-12 h-12 hover:bg-blue-50 transition-colors flex items-center justify-center p-1"
                          title={name || itemId}
                        >
                          {item?.iconPath ? (
                            <img src={item.iconPath} alt={name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                          ) : (
                            <div className="text-[8px] text-slate-300 text-center leading-tight overflow-hidden px-1">{name || itemId}</div>
                          )}
                          {item && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30 shadow-xl">
                              {name}
                            </div>
                          )}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 bg-white min-h-screen">
      <nav className="mb-8 flex items-center gap-2 text-sm font-bold">
        <Link 
          to="/" 
          className="text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-lg"
        >
          {t('menu.mainMenu')}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 px-1">{t('menu.items')}</span>
      </nav>

      <div className="space-y-20">
        <GridTable 
          grid={COMPONENT_GRID} 
          title={t('categories.components')} 
          icon="⚙️" 
        />
        
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-xl">🏭</span>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{t('categories.buildings')}</h2>
          </div>
          
          <div className="inline-block border border-slate-300 rounded overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('categories.logisticsAndProduction')}</span>
            </div>
            <div className="bg-white">
              <table className="border-collapse">
                <tbody>
                  {buildingCategories.map(cat => {
                    const unsortedItems = Object.values(ITEMS).filter(item => item.type === ITEM_TYPES.BUILDING && item.category === cat);
                    if (unsortedItems.length === 0) return null;

                    const order = BUILDING_ORDER[cat] || [];
                    const items = [...unsortedItems].sort((a, b) => {
                      const indexA = order.indexOf(a.id);
                      const indexB = order.indexOf(b.id);
                      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                      if (indexA !== -1) return -1;
                      if (indexB !== -1) return 1;
                      return a.id.localeCompare(b.id);
                    });

                    return (
                      <tr key={cat} className="border-b border-slate-200 last:border-0">
                        <td className="bg-slate-50 px-4 py-2 border-r border-slate-200 min-w-[100px] align-middle">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter whitespace-nowrap">
                            {t(`categories.${cat}`)}
                          </span>
                        </td>
                        <td className="p-1">
                          <div className="flex flex-wrap gap-0">
                            {items.map(item => {
                              const name = getItemName(item);
                              return (
                                <Link
                                  key={item.id}
                                  to={`/item/${item.id}`}
                                  className="group relative block w-12 h-12 hover:bg-blue-50 transition-colors flex items-center justify-center p-1 border border-transparent hover:border-slate-200"
                                  title={name}
                                >
                                  <img src={item.iconPath} alt={name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30 shadow-xl">
                                    {name}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

