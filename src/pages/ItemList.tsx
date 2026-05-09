import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
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
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 rounded-t-3xl">
        <span className="text-xl">{icon}</span>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h2>
      </div>

      <div className="p-4 md:p-6">
        <div className="overflow-x-auto md:overflow-visible scrollbar-thin scrollbar-thumb-slate-200 border border-slate-200 rounded-lg shadow-sm bg-white mx-auto w-fit max-w-full">
          <table className="border-collapse min-w-max md:min-w-0">
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
                      <td key={`${rowIndex}-${colIndex}`} className="p-0 border border-slate-100">
                        <Link
                          to={item ? `/item/${item.id}` : '#'}
                          className="group relative block w-12 h-12 hover:bg-blue-50 transition-colors flex items-center justify-center p-1"
                        >
                          {item?.iconPath ? (
                            <img src={`${import.meta.env.BASE_URL}${item.iconPath}`} alt="" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
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
    <div className="max-w-[1400px] mx-auto py-8 px-4 space-y-8">
      <Breadcrumbs items={[{ label: t('menu.items') }]} />

      <div className="space-y-12 max-w-4xl mx-auto">
        <GridTable 
          grid={COMPONENT_GRID} 
          title={t('categories.components')} 
          icon="⚙️" 
        />
        
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 rounded-t-3xl">
            <span className="text-xl">🏭</span>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('categories.buildings')}</h2>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="border border-slate-200 rounded-lg shadow-sm bg-white mx-auto w-fit max-w-full">
              <table className="w-full border-collapse">
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
                      <tr key={cat} className="border-b border-slate-100 last:border-0">
                        <td className="bg-slate-50/50 px-2 py-2 border-r border-slate-100 w-16 sm:w-20 align-middle">
                          <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter block text-center leading-tight">
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
                                  className="group relative block w-12 h-12 hover:bg-blue-50 transition-colors flex items-center justify-center p-1 border border-transparent hover:border-slate-100 rounded-md"
                                  title={name}
                                >
                                  <img src={`${import.meta.env.BASE_URL}${item.iconPath}`} alt={name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
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

