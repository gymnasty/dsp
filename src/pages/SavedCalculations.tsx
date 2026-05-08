import { Calculator, Trash2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { SavedLayout } from '../types';
import { getItemName } from '../utils/i18n';

export const SavedCalculations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dsp_simulator_layouts');
    if (saved) {
      try {
        setSavedLayouts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved layouts', e);
      }
    }
  }, []);

  const deleteLayout = (id: string) => {
    if (confirm(t('simulator.deleteConfirm'))) {
      const updated = savedLayouts.filter(l => l.id !== id);
      setSavedLayouts(updated);
      localStorage.setItem('dsp_simulator_layouts', JSON.stringify(updated));
    }
  };

  const loadLayout = (layout: SavedLayout) => {
    // We'll navigate to simulator. 
    // Since the simulator loads from its own state, but we want it to load THIS layout,
    // we could use state or a more robust store. For now, we'll use a temporary localStorage key
    // to signal the simulator to load this specific layout on next mount.
    localStorage.setItem('dsp_simulator_load_target', JSON.stringify(layout));
    navigate('/simulator');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Breadcrumbs items={[
        { label: t('menu.simulator'), to: '/simulator' },
        { label: t('menu.savedCalculations') }
      ]} />

      {savedLayouts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
            <Calculator size={32} />
          </div>
          <p className="text-slate-400 font-bold">{t('simulator.empty')}</p>
          <button 
            onClick={() => navigate('/simulator')}
            className="text-blue-600 font-black text-xs hover:underline"
          >
            {t('menu.simulator')} →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLayouts.map(layout => (
            <div key={layout.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col overflow-hidden group">
              <div className="p-6 flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow min-w-0 mr-2">
                    {layout.name && (
                      <h3 className="font-black text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors" title={layout.name}>
                        {layout.name}
                      </h3>
                    )}
                    <p className={`text-[10px] text-slate-400 font-bold ${!layout.name ? 'text-xs' : ''}`}>
                      {new Date(layout.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => deleteLayout(layout.id)}
                    className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const getSummary = () => {
                      let demandIds = layout.inputs.map(i => i.itemId);
                      let supplyIds = layout.outputs.map(i => i.itemId);

                      if (demandIds.length === 0 || supplyIds.length === 0) {
                        const stats: Record<string, number> = {};
                        layout.inputs.forEach(i => stats[i.itemId] = (stats[i.itemId] || 0) + i.rate);
                        layout.outputs.forEach(o => stats[o.itemId] = (stats[o.itemId] || 0) - o.rate);
                        layout.processors.forEach(p => {
                          const recipe = RECIPES.find(r => r.id === p.recipeId);
                          const facility = Object.values(ITEMS).find(i => i.id === p.facilityId);
                          if (recipe && facility) {
                            const speed = facility.productionSpeed || 1;
                            const st = p.count * speed / recipe.time;
                            stats[recipe.outputItemId] = (stats[recipe.outputItemId] || 0) + (recipe.outputCount * st);
                            recipe.extraOutputs?.forEach(ex => {
                              stats[ex.itemId] = (stats[ex.itemId] || 0) + (ex.count * st);
                            });
                            recipe.ingredients.forEach(ing => {
                              stats[ing.itemId] = (stats[ing.itemId] || 0) - (ing.count * st);
                            });
                          }
                        });

                        const calculatedDemand = Object.entries(stats)
                          .filter(([, rate]) => rate < -0.0001)
                          .sort((a, b) => a[1] - b[1])
                          .map(([id]) => id);
                        
                        const calculatedSupply = Object.entries(stats)
                          .filter(([, rate]) => rate > 0.0001)
                          .sort((a, b) => b[1] - a[1])
                          .map(([id]) => id);

                        if (demandIds.length === 0) demandIds = calculatedDemand;
                        if (supplyIds.length === 0) supplyIds = calculatedSupply;
                      }

                      return { demandIds: demandIds.slice(0, 3), supplyIds: supplyIds.slice(0, 3) };
                    };

                    const { demandIds, supplyIds } = getSummary();

                    return (
                      <div className="flex items-center justify-start bg-slate-50 rounded-2xl p-3 border border-slate-100">
                        <div className="flex gap-2 shrink-0">
                          {demandIds.length > 0 ? demandIds.map(id => (
                            <div key={id} className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shadow-sm relative z-10" title={getItemName(Object.values(ITEMS).find(i => i.id === id))}>
                              <img src={`${import.meta.env.BASE_URL}${Object.values(ITEMS).find(i => i.id === id)?.iconPath}`} alt="" className="w-full h-full object-contain" />
                            </div>
                          )) : <div className="w-10 h-10 flex items-center justify-center text-slate-300 italic text-[10px]">?</div>}
                        </div>
                        <ArrowRight size={14} className="text-slate-300 mx-3 shrink-0" />
                        <div className="flex gap-2 shrink-0">
                          {supplyIds.length > 0 ? supplyIds.map(id => (
                            <div key={id} className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shadow-sm relative z-10" title={getItemName(Object.values(ITEMS).find(i => i.id === id))}>
                              <img src={`${import.meta.env.BASE_URL}${Object.values(ITEMS).find(i => i.id === id)?.iconPath}`} alt="" className="w-full h-full object-contain" />
                            </div>
                          )) : <div className="w-10 h-10 flex items-center justify-center text-slate-300 italic text-[10px]">?</div>}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              
              <button 
                onClick={() => loadLayout(layout)}
                className="w-full py-4 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white border-t border-slate-100 group-hover:border-blue-600 text-xs font-black text-slate-600 transition-all flex items-center justify-center gap-2"
              >
                {t('simulator.load')}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
