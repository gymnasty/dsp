import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ITEMS } from '../data/items';
import { COMPONENT_GRID } from '../data/layouts';
import { BUILDING_ORDER } from '../data/buildingOrder';
import { getItemName } from '../utils/i18n';
import { CATEGORIES, ITEM_TYPES, Item } from '../types';
import { Search, X, Settings2, Construction } from 'lucide-react';

interface ItemSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (itemId: string) => void;
  title: string;
  items?: Item[]; // Optional: restrict items to this list
}

export const ItemSelectorModal: React.FC<ItemSelectorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  title,
  items: restrictedItems 
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'component' | 'building'>('component');

  const allItems = useMemo(() => restrictedItems || Object.values(ITEMS), [restrictedItems]);

  const filteredItems = useMemo(() => {
    if (!search) return null;
    const s = search.toLowerCase();
    return allItems.filter(item => 
      getItemName(item).toLowerCase().includes(s) || 
      item.id.toLowerCase().includes(s)
    );
  }, [allItems, search]);

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

  const renderItemButton = (item: Item | null | string) => {
    const itemObj = typeof item === 'string' ? Object.values(ITEMS).find(i => i.id === item) : item;
    if (!itemObj) return <div className="w-10 h-10 border border-slate-100 bg-slate-50/50 rounded" />;

    // Check if item is in restricted list if provided
    const isDisabled = restrictedItems && !restrictedItems.find(ri => ri.id === itemObj.id);

    return (
      <button
        key={itemObj.id}
        disabled={isDisabled}
        onClick={() => {
          onSelect(itemObj.id);
          onClose();
        }}
        className={`group relative w-10 h-10 flex items-center justify-center bg-white rounded border border-slate-200 transition-all active:scale-90 ${
          isDisabled 
            ? 'opacity-20 cursor-not-allowed grayscale' 
            : 'hover:border-blue-500 hover:bg-blue-50'
        }`}
        title={getItemName(itemObj)}
      >
        <img src={`${import.meta.env.BASE_URL}${itemObj.iconPath}`} alt="" className="w-8 h-8 object-contain transition-transform group-hover:scale-110" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
          {getItemName(itemObj)}
        </div>
      </button>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[800px] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col">
        <header className="px-4 md:px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 shrink-0 rounded-t-3xl gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h3 className="text-lg font-black text-slate-800 whitespace-nowrap">{title}</h3>
            <div className="flex bg-slate-200 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('component')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'component' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Settings2 size={14} />
                <span className="truncate">{t('categories.components')}</span>
              </button>
              <button
                onClick={() => setActiveTab('building')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'building' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Construction size={14} />
                <span className="truncate">{t('categories.buildings')}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                autoFocus
                type="text" 
                placeholder={t('menu.search')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-48"
              />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors shrink-0">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto px-4 md:px-6 py-6 md:py-10 scrollbar-thin scrollbar-thumb-slate-200 bg-white rounded-b-3xl">
          {search ? (
            <div className="flex flex-wrap justify-center md:justify-start gap-1">
              {filteredItems?.map(item => renderItemButton(item))}
              {filteredItems?.length === 0 && (
                <div className="w-full py-20 text-center text-slate-400 font-bold">{t('simulator.empty')}</div>
              )}
            </div>
          ) : activeTab === 'component' ? (
            <div className="space-y-4 overflow-x-auto pb-4">
              <table className="border-collapse mx-auto min-w-max">
                <tbody>
                  {COMPONENT_GRID.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((itemId, cIdx) => (
                        <td key={`${rIdx}-${cIdx}`} className="p-0.5">
                          {renderItemButton(itemId)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl shadow-sm max-w-full md:max-w-fit mx-auto overflow-x-auto">
                <table className="border-collapse min-w-full md:min-w-max">
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
                          <td className="bg-slate-50 px-2 sm:px-3 py-1 border-r border-slate-200 align-middle min-w-[70px] sm:min-w-[80px]">
                            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                              {t(`categories.${cat}`)}
                            </span>
                          </td>
                          <td className="p-0.5">
                            <div className="flex flex-wrap gap-0.5">
                              {items.map(item => renderItemButton(item))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
