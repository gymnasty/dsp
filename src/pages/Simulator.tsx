import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { getItemName } from '../utils/i18n';
import { Plus, Trash2, Calculator, Package, Factory, TrendingUp } from 'lucide-react';

interface InputState {
  itemId: string;
  rate: number;
}

interface ProcessorState {
  recipeId: string;
  count: number;
}

export const Simulator = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<InputState[]>([]);
  const [processors, setProcessors] = useState<ProcessorState[]>([]);

  // Local state for adding new items
  const sortedItems = useMemo(() => Object.values(ITEMS).sort((a, b) => getItemName(a).localeCompare(getItemName(b))), []);
  const sortedRecipes = useMemo(() => [...RECIPES].sort((a, b) => {
    const itemA = Object.values(ITEMS).find(i => i.id === a.outputItemId);
    const itemB = Object.values(ITEMS).find(i => i.id === b.outputItemId);
    return getItemName(itemA).localeCompare(getItemName(itemB));
  }), []);

  const [newItemId, setNewItemId] = useState(sortedItems[0]?.id || '');
  const [newRate, setNewRate] = useState(1);
  const [newRecipeId, setNewRecipeId] = useState(sortedRecipes[0]?.id || '');
  const [newCount, setNewCount] = useState(1);

  const addInput = () => {
    if (!newItemId) return;
    setInputs([...inputs, { itemId: newItemId, rate: newRate }]);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const addProcessor = () => {
    if (!newRecipeId) return;
    setProcessors([...processors, { recipeId: newRecipeId, count: newCount }]);
  };

  const removeProcessor = (index: number) => {
    setProcessors(processors.filter((_, i) => i !== index));
  };

  // Calculation
  const results = useMemo(() => {
    const itemStats: Record<string, { input: number; consumption: number; production: number }> = {};

    const getStat = (id: string) => {
      if (!itemStats[id]) {
        itemStats[id] = { input: 0, consumption: 0, production: 0 };
      }
      return itemStats[id];
    };

    // External inputs
    inputs.forEach(input => {
      getStat(input.itemId).input += input.rate;
    });

    // Processors
    processors.forEach(proc => {
      const recipe = RECIPES.find(r => r.id === proc.recipeId);
      if (recipe) {
        const multiplier = proc.count / recipe.time;
        
        // Output
        getStat(recipe.outputItemId).production += recipe.outputCount * multiplier;
        
        // Extra Outputs
        recipe.extraOutputs?.forEach(extra => {
          getStat(extra.itemId).production += extra.count * multiplier;
        });

        // Ingredients
        recipe.ingredients.forEach(ing => {
          getStat(ing.itemId).consumption += ing.count * multiplier;
        });
      }
    });

    return Object.entries(itemStats).map(([id, stats]) => ({
      id,
      ...stats,
      netRate: stats.input + stats.production - stats.consumption
    })).filter(item => 
      Math.abs(item.netRate) > 0.0001 || 
      item.input > 0 || 
      item.consumption > 0 || 
      item.production > 0
    );
  }, [inputs, processors]);

  const sortedResults = useMemo(() => [...results].sort((a, b) => b.netRate - a.netRate), [results]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Calculator size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('simulator.title')}</h1>
          <p className="text-slate-500 font-medium">{t('home.subtitle')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Config */}
        <div className="space-y-8">
          {/* Inputs Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Package size={16} />
                {t('simulator.inputs')}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <select 
                  value={newItemId} 
                  onChange={(e) => setNewItemId(e.target.value)}
                  className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {sortedItems.map(item => (
                    <option key={item.id} value={item.id}>{getItemName(item)}</option>
                  ))}
                </select>
                <div className="flex items-center bg-slate-100 rounded-xl px-3">
                  <input 
                    type="number" 
                    value={newRate}
                    onChange={(e) => setNewRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-16 bg-transparent border-none text-right font-mono font-bold focus:ring-0"
                  />
                  <span className="text-[10px] font-black text-slate-400 ml-1 uppercase">{t('simulator.perSecond')}</span>
                </div>
                <button 
                  onClick={addInput}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {inputs.map((input, idx) => {
                  const item = Object.values(ITEMS).find(i => i.id === input.itemId);
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <img src={item?.iconPath} alt="" className="w-8 h-8 object-contain" />
                        <span className="text-sm font-bold text-slate-700">{getItemName(item)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono font-black text-blue-600">
                          {input.rate.toFixed(2)}{t('simulator.perSecond')}
                        </span>
                        <button 
                          onClick={() => removeInput(idx)}
                          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Processors Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Factory size={16} />
                {t('simulator.processors')}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <select 
                  value={newRecipeId} 
                  onChange={(e) => setNewRecipeId(e.target.value)}
                  className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {sortedRecipes.map(recipe => {
                    const outputItem = Object.values(ITEMS).find(i => i.id === recipe.outputItemId);
                    return (
                      <option key={recipe.id} value={recipe.id}>
                        {getItemName(outputItem)} ({t(`facilities.${recipe.producedIn}`)})
                      </option>
                    );
                  })}
                </select>
                <div className="flex items-center bg-slate-100 rounded-xl px-3">
                  <input 
                    type="number" 
                    value={newCount}
                    onChange={(e) => setNewCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 bg-transparent border-none text-right font-mono font-bold focus:ring-0"
                  />
                  <span className="text-[10px] font-black text-slate-400 ml-1 uppercase">x</span>
                </div>
                <button 
                  onClick={addProcessor}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {processors.map((proc, idx) => {
                  const recipe = RECIPES.find(r => r.id === proc.recipeId);
                  const item = Object.values(ITEMS).find(i => i.id === recipe?.outputItemId);
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <img src={item?.iconPath} alt="" className="w-8 h-8 object-contain" />
                        <div>
                          <p className="text-sm font-bold text-slate-700">{getItemName(item)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t(`facilities.${recipe?.producedIn}`)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono font-black text-blue-600">
                          x{proc.count}
                        </span>
                        <button 
                          onClick={() => removeProcessor(idx)}
                          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-8">
          <section className="bg-slate-900 rounded-3xl text-white shadow-xl overflow-hidden flex flex-col h-full">
            <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} />
                {t('simulator.results')}
              </h2>
            </div>
            <div className="p-8 flex-grow overflow-auto">
              {sortedResults.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
                  <Calculator size={48} className="opacity-20" />
                  <p className="text-sm font-bold text-center max-w-xs">{t('simulator.empty')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedResults.map((res) => {
                    const item = Object.values(ITEMS).find(i => i.id === res.id);
                    const isPositive = res.netRate > 0.0001;
                    const isNegative = res.netRate < -0.0001;
                    
                    return (
                      <div key={res.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center p-1.5">
                              <img src={item?.iconPath} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-slate-100">{getItemName(item)}</span>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-mono font-black ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
                              {res.netRate > 0 ? '+' : ''}{res.netRate.toFixed(2)}
                              <span className="text-xs ml-1 font-bold opacity-50 uppercase">{t('simulator.perSecond')}</span>
                            </p>
                            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                              {(res.netRate * 60).toFixed(1)}{t('simulator.perMinute')}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.inputRate')}</p>
                            <p className="text-xs font-mono font-bold text-slate-300">{res.input.toFixed(2)}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.production')}</p>
                            <p className="text-xs font-mono font-bold text-green-400/70">{res.production.toFixed(2)}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.consumption')}</p>
                            <p className="text-xs font-mono font-bold text-red-400/70">{res.consumption.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
