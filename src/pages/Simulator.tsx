import { ArrowDownToLine, ArrowRight, Calculator, Factory, Package, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { ITEM_TYPES } from '../types';
import { getItemName } from '../utils/i18n';
import { ItemSelectorModal } from '../components/ItemSelectorModal';

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
  facilityId: string;
}

export const Simulator = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<InputState[]>([]);
  const [outputs, setOutputs] = useState<OutputState[]>([]);
  const [processors, setProcessors] = useState<ProcessorState[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<'input' | 'output' | 'processor_item' | 'processor_facility' | null>(null);

  // Local state for adding new items
  const sortedItems = useMemo(() => Object.values(ITEMS), []);
  
  // Producible items for processor selection
  const producibleItems = useMemo(() => {
    const producibleIds = new Set(RECIPES.map(r => r.outputItemId));
    return sortedItems.filter(item => producibleIds.has(item.id));
  }, [sortedItems]);

  const [selectedProduceItemId, setSelectedProduceItemId] = useState(producibleItems[0]?.id || '');

  const availableFacilities = useMemo(() => {
    if (!selectedProduceItemId) return [];
    const recipes = RECIPES.filter(r => r.outputItemId === selectedProduceItemId);
    const facilityTypes = new Set(recipes.map(r => r.producedIn));
    
    // Find all building items that match any of these facility types
    return Object.values(ITEMS).filter(item => 
      item.type === ITEM_TYPES.BUILDING && 
      item.facilityType && 
      facilityTypes.has(item.facilityType)
    );
  }, [selectedProduceItemId]);

  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  // Update selectedFacilityId when availableFacilities changes
  useEffect(() => {
    if (availableFacilities.length > 0) {
      const currentExists = availableFacilities.find(i => i.id === selectedFacilityId);
      if (!currentExists) {
        setSelectedFacilityId(availableFacilities[0].id);
      }
    } else {
      setSelectedFacilityId('');
    }
  }, [availableFacilities, selectedFacilityId]);

  const [newItemId, setNewItemId] = useState(sortedItems[0]?.id || '');
  const [newRate, setNewRate] = useState(1);
  const [newTargetItemId, setNewTargetItemId] = useState(sortedItems[0]?.id || '');
  const [newTargetRate, setNewTargetRate] = useState(1);

  const openModal = (target: 'input' | 'output' | 'processor_item' | 'processor_facility') => {
    setModalTarget(target);
    setIsModalOpen(true);
  };

  const handleModalSelect = (itemId: string) => {
    if (modalTarget === 'input') setNewItemId(itemId);
    if (modalTarget === 'output') setNewTargetItemId(itemId);
    if (modalTarget === 'processor_item') setSelectedProduceItemId(itemId);
    if (modalTarget === 'processor_facility') setSelectedFacilityId(itemId);
    setIsModalOpen(false);
  };

  const availableRecipes = useMemo(() => {
    if (!selectedProduceItemId || !selectedFacilityId) return [];
    const facilityItem = Object.values(ITEMS).find(i => i.id === selectedFacilityId);
    if (!facilityItem?.facilityType) return [];
    
    return RECIPES.filter(r => 
      r.outputItemId === selectedProduceItemId && 
      r.producedIn === facilityItem.facilityType
    );
  }, [selectedProduceItemId, selectedFacilityId]);
  
  const [newRecipeId, setNewRecipeId] = useState('');
  useEffect(() => {
    if (availableRecipes.length > 0) {
      setNewRecipeId(availableRecipes[0].id);
    } else {
      setNewRecipeId('');
    }
  }, [availableRecipes]);

  const addProcessor = () => {
    if (!newRecipeId || !selectedFacilityId) return;
    setProcessors([...processors, { recipeId: newRecipeId, count: 1, facilityId: selectedFacilityId }]);
  };

  const updateProcessorCount = (index: number, count: number) => {
    const nextProcessors = [...processors];
    nextProcessors[index].count = Math.max(0, count);
    setProcessors(nextProcessors);
  };

  const removeProcessor = (index: number) => {
    setProcessors(processors.filter((_, i) => i !== index));
  };

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
      const facilityItem = Object.values(ITEMS).find(i => i.id === proc.facilityId);
      
      if (recipe) {
        const speed = facilityItem?.productionSpeed || 1;
        const multiplier = (proc.count * speed) / recipe.time;
        
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

  const newItem = Object.values(ITEMS).find(i => i.id === newItemId);
  const newTargetItem = Object.values(ITEMS).find(i => i.id === newTargetItemId);
  const selectedProduceItem = Object.values(ITEMS).find(i => i.id === selectedProduceItemId);

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

      <div className="space-y-8">
        {/* Config Sections */}
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
                <button 
                  onClick={() => openModal('input')}
                  className="flex-grow flex items-center gap-3 bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2 transition-all group"
                >
                  <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm border border-slate-200 group-hover:scale-110 transition-transform">
                    <img src={newItem?.iconPath} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{getItemName(newItem)}</span>
                </button>
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
                <button 
                  onClick={() => openModal('output')}
                  className="flex-grow flex items-center gap-3 bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2 transition-all group"
                >
                  <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm border border-slate-200 group-hover:scale-110 transition-transform">
                    <img src={newTargetItem?.iconPath} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{getItemName(newTargetItem)}</span>
                </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('simulator.item')}</label>
                <button 
                  onClick={() => openModal('processor_item')}
                  className="w-full flex items-center gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-4 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <img src={selectedProduceItem?.iconPath} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tight">{t('menu.items')}</span>
                    <span className="text-sm font-black text-slate-700">{getItemName(selectedProduceItem)}</span>
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('itemDetail.facility')}</label>
                <div className="flex flex-wrap gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {availableFacilities.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFacilityId(item.id)}
                      className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                        selectedFacilityId === item.id 
                          ? 'bg-white border-2 border-blue-600 shadow-md ring-2 ring-blue-600/10 scale-105' 
                          : 'bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      title={getItemName(item)}
                    >
                      <img src={item.iconPath} alt="" className="w-9 h-9 object-contain group-hover:scale-110 transition-transform" />
                      {selectedFacilityId === item.id && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm">
                        </div>
                      )}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {getItemName(item)}
                      </div>
                    </button>
                  ))}
                  {availableFacilities.length === 0 && (
                    <p className="text-[10px] font-bold text-slate-400 p-2 italic">{t('simulator.empty')}</p>
                  )}
                </div>
              </div>
            </div>

            {availableRecipes.length > 0 && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {availableRecipes.length > 1 ? t('itemDetail.productionRecipe') : t('itemDetail.productionRecipe')}
                </label>
                
                <div className="grid grid-cols-1 gap-2">
                  {availableRecipes.map(recipe => {
                    const isSelected = newRecipeId === recipe.id;
                    return (
                      <button
                        key={recipe.id}
                        onClick={() => setNewRecipeId(recipe.id)}
                        className={`flex items-center gap-4 p-3 rounded-2xl border transition-all text-left ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-600/10' 
                            : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        <div className="flex-grow flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {recipe.ingredients.map(ing => {
                              const ingItem = Object.values(ITEMS).find(i => i.id === ing.itemId);
                              return (
                                <div key={ing.itemId} className="relative">
                                  <img src={ingItem?.iconPath} alt="" className="w-6 h-6 object-contain" title={getItemName(ingItem)} />
                                  <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-white/90 px-0.5 rounded leading-none border border-slate-100">{ing.count}</span>
                                </div>
                              );
                            })}
                          </div>
                          <ArrowRight size={14} className="text-slate-300" />
                          <div className="flex items-center gap-1">
                            {[
                              { itemId: recipe.outputItemId, count: recipe.outputCount },
                              ...(recipe.extraOutputs || []).map(e => ({ itemId: e.itemId, count: e.count }))
                            ].map((out, i) => {
                              const outItem = Object.values(ITEMS).find(i => i.id === out.itemId);
                              return (
                                <div key={`${out.itemId}-${i}`} className="relative">
                                  <img src={outItem?.iconPath} alt="" className="w-6 h-6 object-contain" title={getItemName(outItem)} />
                                  <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-white/90 px-0.5 rounded leading-none border border-slate-100">{out.count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                          {recipe.time}s
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={addProcessor}
                disabled={!newRecipeId || !selectedFacilityId}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold flex items-center gap-2"
              >
                <Plus size={20} />
                {t('simulator.addRecipe')}
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              {processors.map((proc, idx) => {
                const recipe = RECIPES.find(r => r.id === proc.recipeId);
                const facilityItem = Object.values(ITEMS).find(i => i.id === proc.facilityId);
                const speed = facilityItem?.productionSpeed || 1;
                const rate = recipe ? (recipe.outputCount * proc.count * speed) / recipe.time : 0;
                
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-slate-100">
                        <img src={facilityItem?.iconPath} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{getItemName(facilityItem)}</p>
                      </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1">
                        {recipe?.ingredients.map(ing => {
                          const ingItem = Object.values(ITEMS).find(i => i.id === ing.itemId);
                          return (
                            <div key={ing.itemId} className="relative group/ing">
                              <img src={ingItem?.iconPath} alt="" className="w-6 h-6 object-contain" title={getItemName(ingItem)} />
                              <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-white/80 px-0.5 rounded leading-none border border-slate-200">{ing.count}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-slate-300">
                        <ArrowRight size={16} />
                      </div>
                      <div className="flex items-center gap-1">
                        {[
                          { itemId: recipe?.outputItemId, count: recipe?.outputCount },
                          ...(recipe?.extraOutputs || []).map(e => ({ itemId: e.itemId, count: e.count }))
                        ].map((out, i) => {
                          const outItem = Object.values(ITEMS).find(i => i.id === out.itemId);
                          return (
                            <div key={`${out.itemId}-${i}`} className="relative group/out">
                              <img src={outItem?.iconPath} alt="" className="w-6 h-6 object-contain" title={getItemName(outItem)} />
                              <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-white/80 px-0.5 rounded leading-none border border-slate-200">{out.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          +{rate.toFixed(2)}/s
                        </p>
                      </div>

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

        {/* Results Section */}
        <section className="bg-slate-900 rounded-3xl text-white shadow-xl overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} />
              {t('simulator.results')}
            </h2>
          </div>
          <div className="p-8">
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

      <ItemSelectorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleModalSelect}
        title={
          modalTarget === 'input' ? t('simulator.inputs') :
          modalTarget === 'output' ? t('simulator.externalOutput') :
          modalTarget === 'processor_item' ? t('simulator.item') :
          modalTarget === 'processor_facility' ? t('itemDetail.facility') : ''
        }
        items={
          modalTarget === 'processor_item' ? producibleItems :
          modalTarget === 'processor_facility' ? availableFacilities :
          undefined
        }
      />
    </div>
  );
};
