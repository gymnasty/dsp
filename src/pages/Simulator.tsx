import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { ITEM_TYPES } from '../types';
import { getItemName } from '../utils/i18n';
import { Plus, Trash2, Calculator, Package, Factory, TrendingUp, ArrowDownToLine } from 'lucide-react';

interface InputState {
  itemId: string;
  rate: number;
}

interface OutputState {
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
  const [outputs, setOutputs] = useState<OutputState[]>([]);
  const [processors, setProcessors] = useState<ProcessorState[]>([]);

  // Local state for adding new items
  const sortedItems = useMemo(() => Object.values(ITEMS).sort((a, b) => getItemName(a).localeCompare(getItemName(b))), []);
  
  // Items that can be produced (have at least one recipe)
  const producibleItems = useMemo(() => {
    const ids = new Set(RECIPES.map(r => r.outputItemId));
    return sortedItems.filter(item => ids.has(item.id));
  }, [sortedItems]);

  // Facilities that can produce something
  const availableFacilities = useMemo(() => {
    const facilities = new Set(RECIPES.map(r => r.producedIn));
    return Array.from(facilities).sort((a, b) => t(`facilities.${a}`).localeCompare(t(`facilities.${b}`)));
  }, [t]);

  const [newItemId, setNewItemId] = useState(sortedItems[0]?.id || '');
  const [newRate, setNewRate] = useState(1);
  
  const [newTargetItemId, setNewTargetItemId] = useState(sortedItems[0]?.id || '');
  const [newTargetRate, setNewTargetRate] = useState(1);

  const [selectedFacility, setSelectedFacility] = useState(availableFacilities[0] || '');

  const itemsForFacility = useMemo(() => {
    const recipes = RECIPES.filter(r => r.producedIn === selectedFacility);
    const itemIds = new Set(recipes.map(r => r.outputItemId));
    return sortedItems.filter(item => itemIds.has(item.id));
  }, [selectedFacility, sortedItems]);

  const [selectedProduceItemId, setSelectedProduceItemId] = useState('');
  
  // Update selectedProduceItemId when itemsForFacility changes
  useEffect(() => {
    if (itemsForFacility.length > 0) {
      if (!itemsForFacility.find(i => i.id === selectedProduceItemId)) {
        setSelectedProduceItemId(itemsForFacility[0].id);
      }
    } else {
      setSelectedProduceItemId('');
    }
  }, [itemsForFacility, selectedProduceItemId]);

  const availableRecipes = useMemo(() => 
    RECIPES.filter(r => r.outputItemId === selectedProduceItemId && r.producedIn === selectedFacility),
  [selectedProduceItemId, selectedFacility]);
  
  const [newRecipeId, setNewRecipeId] = useState('');
  useEffect(() => {
    if (availableRecipes.length > 0) {
      setNewRecipeId(availableRecipes[0].id);
    } else {
      setNewRecipeId('');
    }
  }, [availableRecipes]);

  const [newCount, setNewCount] = useState(1);

  const addInput = () => {
    if (!newItemId) return;
    setInputs([...inputs, { itemId: newItemId, rate: newRate }]);
  };

  const updateInputRate = (index: number, rate: number) => {
    const nextInputs = [...inputs];
    nextInputs[index].rate = Math.max(0, rate);
    setInputs(nextInputs);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const addOutput = () => {
    if (!newTargetItemId) return;
    setOutputs([...outputs, { itemId: newTargetItemId, rate: newTargetRate }]);
  };

  const updateOutputRate = (index: number, rate: number) => {
    const nextOutputs = [...outputs];
    nextOutputs[index].rate = Math.max(0, rate);
    setOutputs(nextOutputs);
  };

  const removeOutput = (index: number) => {
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  const addProcessor = () => {
    if (!newRecipeId) return;
    setProcessors([...processors, { recipeId: newRecipeId, count: newCount }]);
  };

  const updateProcessorCount = (index: number, count: number) => {
    const nextProcessors = [...processors];
    nextProcessors[index].count = Math.max(0, count);
    setProcessors(nextProcessors);
  };

  const removeProcessor = (index: number) => {
    setProcessors(processors.filter((_, i) => i !== index));
  };

  // Calculation
  const results = useMemo(() => {
    const itemStats: Record<string, { input: number; consumption: number; production: number; sink: number }> = {};

    const getStat = (id: string) => {
      if (!itemStats[id]) {
        itemStats[id] = { input: 0, consumption: 0, production: 0, sink: 0 };
      }
      return itemStats[id];
    };

    // External inputs
    inputs.forEach(input => {
      getStat(input.itemId).input += input.rate;
    });

    // External outputs (Sinks)
    outputs.forEach(output => {
      getStat(output.itemId).sink += output.rate;
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
      netRate: stats.input + stats.production - stats.consumption - stats.sink
    })).filter(item => 
      Math.abs(item.netRate) > 0.0001 || 
      item.input > 0 || 
      item.consumption > 0 || 
      item.production > 0 ||
      item.sink > 0
    );
  }, [inputs, outputs, processors]);

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
        <div className="flex-grow"></div>
        <button 
          onClick={() => { if(confirm(t('simulator.clearAll') + '?')) { setInputs([]); setOutputs([]); setProcessors([]); } }}
          className="px-4 py-2 bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <Trash2 size={14} />
          {t('simulator.clearAll')}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Config */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inputs Section */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package size={16} />
                  {t('simulator.inputs')}
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-grow">
                <div className="flex gap-2">
                  <select 
                    value={newItemId} 
                    onChange={(e) => setNewItemId(e.target.value)}
                    className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all min-w-0"
                  >
                    {sortedItems.map(item => (
                      <option key={item.id} value={item.id}>{getItemName(item)}</option>
                    ))}
                  </select>
                  <div className="flex items-center bg-slate-100 rounded-xl px-2 shrink-0">
                    <input 
                      type="number" 
                      value={newRate}
                      onChange={(e) => setNewRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-xs"
                    />
                    <span className="text-[10px] font-black text-slate-400 ml-1 uppercase">/s</span>
                  </div>
                  <button 
                    onClick={addInput}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  {inputs.map((input, idx) => {
                    const item = Object.values(ITEMS).find(i => i.id === input.itemId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={item?.iconPath} alt="" className="w-6 h-6 object-contain shrink-0" />
                          <span className="text-xs font-bold text-slate-700 truncate">{getItemName(item)}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <input 
                              type="number" 
                              value={input.rate}
                              step="0.1"
                              onChange={(e) => updateInputRate(idx, parseFloat(e.target.value) || 0)}
                              className="w-12 bg-transparent border-none text-right font-mono font-black text-blue-600 focus:ring-0 text-xs p-0"
                            />
                            <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                          </div>
                          <button 
                            onClick={() => removeInput(idx)}
                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Outputs (Sinks) Section */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ArrowDownToLine size={16} />
                  {t('simulator.externalOutput')}
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-grow">
                <div className="flex gap-2">
                  <select 
                    value={newTargetItemId} 
                    onChange={(e) => setNewTargetItemId(e.target.value)}
                    className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all min-w-0"
                  >
                    {sortedItems.map(item => (
                      <option key={item.id} value={item.id}>{getItemName(item)}</option>
                    ))}
                  </select>
                  <div className="flex items-center bg-slate-100 rounded-xl px-2 shrink-0">
                    <input 
                      type="number" 
                      value={newTargetRate}
                      onChange={(e) => setNewTargetRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-xs"
                    />
                    <span className="text-[10px] font-black text-slate-400 ml-1 uppercase">/s</span>
                  </div>
                  <button 
                    onClick={addOutput}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  {outputs.map((output, idx) => {
                    const item = Object.values(ITEMS).find(i => i.id === output.itemId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={item?.iconPath} alt="" className="w-6 h-6 object-contain shrink-0" />
                          <span className="text-xs font-bold text-slate-700 truncate">{getItemName(item)}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <input 
                              type="number" 
                              value={output.rate}
                              step="0.1"
                              onChange={(e) => updateOutputRate(idx, parseFloat(e.target.value) || 0)}
                              className="w-12 bg-transparent border-none text-right font-mono font-black text-orange-600 focus:ring-0 text-xs p-0"
                            />
                            <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                          </div>
                          <button 
                            onClick={() => removeOutput(idx)}
                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Processors Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Factory size={16} />
                {t('simulator.processors')}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('itemDetail.facility')}</label>
                  <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{t(`facilities.${selectedFacility}`)}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {availableFacilities.map(f => {
                    // Try to find a building item that matches this facility type for the icon
                    const facilityItem = Object.values(ITEMS).find(item => 
                      item.type === ITEM_TYPES.BUILDING && 
                      item.id.toLowerCase().replace(/_/g, '') === f.toLowerCase().replace(/ /g, '')
                    ) || Object.values(ITEMS).find(item => item.id.includes(f.toLowerCase().split(' ')[0]));

                    return (
                      <button
                        key={f}
                        onClick={() => setSelectedFacility(f)}
                        className={`group relative w-12 h-12 rounded border transition-all flex items-center justify-center p-1 ${
                          selectedFacility === f 
                            ? 'border-blue-500 bg-blue-50 shadow-sm z-10' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        title={t(`facilities.${f}`)}
                      >
                        <img 
                          src={facilityItem?.iconPath} 
                          alt={t(`facilities.${f}`)} 
                          className={`w-10 h-10 object-contain transition-transform group-hover:scale-110 ${selectedFacility === f ? 'scale-110' : ''}`}
                        />
                        {selectedFacility === f && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('simulator.item')}</label>
                  {selectedProduceItemId && (
                    <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                      {getItemName(Object.values(ITEMS).find(i => i.id === selectedProduceItemId))}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50 rounded-lg">
                  {itemsForFacility.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedProduceItemId(item.id)}
                      className={`group relative w-12 h-12 rounded border transition-all flex items-center justify-center p-1 ${
                        selectedProduceItemId === item.id 
                          ? 'border-blue-500 bg-blue-50 shadow-sm z-10' 
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                      }`}
                      title={getItemName(item)}
                    >
                      <img 
                        src={item.iconPath} 
                        alt={getItemName(item)} 
                        className={`w-10 h-10 object-contain transition-transform group-hover:scale-110 ${selectedProduceItemId === item.id ? 'scale-110' : ''}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {availableRecipes.length > 1 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('itemDetail.productionRecipe')}</label>
                  <select 
                    value={newRecipeId} 
                    onChange={(e) => setNewRecipeId(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {availableRecipes.map(recipe => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.ingredients.map(ing => getItemName(Object.values(ITEMS).find(item => item.id === ing.itemId))).join(' + ')} 
                        {' -> '} 
                        {recipe.outputCount}x {getItemName(Object.values(ITEMS).find(item => item.id === recipe.outputItemId))}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex gap-4 pt-2">
                <div className="flex-grow flex items-center bg-slate-100 rounded-2xl px-4 py-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">{t('simulator.count')}</label>
                  <input 
                    type="number" 
                    value={newCount}
                    onChange={(e) => setNewCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-grow bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-lg"
                  />
                  <span className="text-slate-400 font-bold ml-2">台</span>
                </div>
                <button 
                  onClick={addProcessor}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold flex items-center gap-2"
                >
                  <Plus size={20} />
                  {t('simulator.addRecipe')}
                </button>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                {processors.map((proc, idx) => {
                  const recipe = RECIPES.find(r => r.id === proc.recipeId);
                  const item = Object.values(ITEMS).find(i => i.id === recipe?.outputItemId);
                  const rate = recipe ? (recipe.outputCount * proc.count) / recipe.time : 0;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-slate-100">
                          <img src={item?.iconPath} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{getItemName(item)}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-1.5 py-0.5 rounded border border-slate-100">
                              {t(`facilities.${recipe?.producedIn}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1 shadow-inner">
                            <input 
                              type="number" 
                              value={proc.count}
                              onChange={(e) => updateProcessorCount(idx, parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent border-none text-right font-mono font-black text-blue-600 focus:ring-0 text-lg p-0"
                            />
                            <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-tighter">台</span>
                          </div>
                          <div className="mt-1 text-right">
                            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                              +{rate.toFixed(2)}/s
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => removeProcessor(idx)}
                          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                        >
                          <Trash2 size={20} />
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
          <section className="bg-slate-900 rounded-3xl text-white shadow-xl overflow-hidden flex flex-col h-full sticky top-24">
            <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} />
                {t('simulator.results')}
              </h2>
            </div>
            <div className="p-8 flex-grow">
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
                      <div key={res.id} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center p-2">
                              <img src={item?.iconPath} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-100 block">{getItemName(item)}</span>
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                                {(res.netRate * 60).toFixed(1)}/min
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-mono font-black leading-none ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
                              {res.netRate > 0 ? '+' : ''}{res.netRate.toFixed(2)}
                              <span className="text-xs ml-1 font-bold opacity-50 uppercase">/s</span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.inputRate')}</p>
                            <p className="text-xs font-mono font-bold text-slate-300">{res.input > 0 ? `+${res.input.toFixed(1)}` : '0'}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.production')}</p>
                            <p className="text-xs font-mono font-bold text-green-400/70">{res.production > 0 ? `+${res.production.toFixed(1)}` : '0'}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.consumption')}</p>
                            <p className="text-xs font-mono font-bold text-red-400/70">{res.consumption > 0 ? `-${res.consumption.toFixed(1)}` : '0'}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg py-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('simulator.externalOutput')}</p>
                            <p className="text-xs font-mono font-bold text-orange-400/70">{res.sink > 0 ? `-${res.sink.toFixed(1)}` : '0'}</p>
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
