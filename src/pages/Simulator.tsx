import { ArrowDownToLine, ArrowRight, Calculator, ChevronDown, ChevronUp, Factory, Package, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemSelectorModal } from '../components/ItemSelectorModal';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { ITEM_TYPES } from '../types';
import { getItemName } from '../utils/i18n';

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

  // Collapsible Sections State
  const [isIoOpen, setIsIoOpen] = useState(true);
  const [isProcessorsOpen, setIsProcessorsOpen] = useState(true);

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

  const [selectedProduceItemId, setSelectedProduceItemId] = useState('');

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

  const [newItemId, setNewItemId] = useState('');
  const [newRate, setNewRate] = useState(1);
  const [newTargetItemId, setNewTargetItemId] = useState('');
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
  
  const addProcessor = (recipeId: string) => {
    if (!recipeId || !selectedFacilityId) return;
    setProcessors([...processors, { recipeId: recipeId, count: 1, facilityId: selectedFacilityId }]);
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

  const producibleItemIds = useMemo(() => new Set(RECIPES.map(r => r.outputItemId)), []);

  const handleResultItemClick = (itemId: string) => {
    if (producibleItemIds.has(itemId)) {
      setSelectedProduceItemId(itemId);
      setIsProcessorsOpen(true);
      // Scroll to processors section for better UX
      const section = document.getElementById('processors-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

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
        </div>
        <div className="flex-grow"></div>
        <button 
          onClick={() => { 
            if(confirm(t('simulator.clearAll') + '?')) { 
              setInputs([]); 
              setOutputs([]); 
              setProcessors([]); 
              setNewItemId('');
              setNewTargetItemId('');
              setSelectedProduceItemId('');
              setSelectedFacilityId('');
            } 
          }}
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
            <button 
              onClick={() => setIsIoOpen(!isIoOpen)}
              className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center w-full hover:bg-slate-100 transition-colors"
            >
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Package size={14} />
                {t('simulator.inputs')}
              </h2>
              {isIoOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </button>
            {isIoOpen && (
              <div className="p-4 space-y-4 flex-grow">
                {/* Compact Add Input */}
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => openModal('input')}
                    className="flex-grow flex items-center gap-2 bg-white hover:bg-slate-100 rounded-xl px-3 py-1.5 transition-all group border border-slate-200 shadow-sm"
                  >
                    <div className="w-6 h-6 bg-white rounded p-1 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform flex items-center justify-center">
                      {newItem ? (
                        <img src={`${import.meta.env.BASE_URL}${newItem.iconPath}`} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Package size={12} className="text-slate-300" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold ${newItem ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                      {newItem ? getItemName(newItem) : t('simulator.select')}
                    </span>
                  </button>
                  <div className="flex items-center bg-white rounded-xl px-2 shrink-0 border border-slate-200 shadow-sm">
                    <input 
                      type="number" 
                      value={newRate}
                      onChange={(e) => setNewRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-10 bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-[10px] p-1 text-blue-600"
                    />
                    <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                  </div>
                  <button 
                    onClick={addInput}
                    disabled={!newItemId}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-1.5 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95 shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[10px]">
                    <thead className="text-slate-400 font-black uppercase tracking-tighter border-b border-slate-100">
                      <tr>
                        <th className="px-2 py-1 text-left">{t('simulator.item')}</th>
                        <th className="px-2 py-1 text-right w-20">{t('simulator.rate')}</th>
                        <th className="px-2 py-1 text-right w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inputs.map((input, idx) => {
                        const item = Object.values(ITEMS).find(i => i.id === input.itemId);
                        return (
                          <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-2 py-1.5">
                              <div className="flex items-center gap-2">
                                <img src={`${import.meta.env.BASE_URL}${item?.iconPath}`} alt="" className="w-5 h-5 object-contain shrink-0" />
                                <span className="font-bold text-slate-700 truncate">{getItemName(item)}</span>
                              </div>
                            </td>
                            <td className="px-2 py-1.5">
                              <div className="flex items-center justify-end">
                                <input 
                                  type="number" 
                                  value={input.rate}
                                  step="0.1"
                                  onChange={(e) => updateInputRate(idx, parseFloat(e.target.value) || 0)}
                                  className="w-12 bg-transparent border-none text-right font-mono font-black text-blue-600 focus:ring-0 text-[10px] p-0"
                                />
                                <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                              </div>
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <button 
                                onClick={() => removeInput(idx)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Outputs (Sinks) Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <button 
              onClick={() => setIsIoOpen(!isIoOpen)}
              className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center w-full hover:bg-slate-100 transition-colors"
            >
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ArrowDownToLine size={14} />
                {t('simulator.externalOutput')}
              </h2>
              {isIoOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </button>
            {isIoOpen && (
              <div className="p-4 space-y-4 flex-grow">
                {/* Compact Add Output */}
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => openModal('output')}
                    className="flex-grow flex items-center gap-2 bg-white hover:bg-slate-100 rounded-xl px-3 py-1.5 transition-all group border border-slate-200 shadow-sm"
                  >
                    <div className="w-6 h-6 bg-white rounded p-1 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform flex items-center justify-center">
                      {newTargetItem ? (
                        <img src={`${import.meta.env.BASE_URL}${newTargetItem.iconPath}`} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Package size={12} className="text-slate-300" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold ${newTargetItem ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                      {newTargetItem ? getItemName(newTargetItem) : t('simulator.select')}
                    </span>
                  </button>
                  <div className="flex items-center bg-white rounded-xl px-2 shrink-0 border border-slate-200 shadow-sm">
                    <input
                      type="number"
                      value={newTargetRate}
                      onChange={(e) => setNewTargetRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-10 bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-[10px] p-1 text-orange-600"
                    />
                    <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                  </div>
                  <button
                    onClick={addOutput}
                    disabled={!newTargetItemId}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-1.5 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95 shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[10px]">
                    <thead className="text-slate-400 font-black uppercase tracking-tighter border-b border-slate-100">
                      <tr>
                        <th className="px-2 py-1 text-left">{t('simulator.item')}</th>
                        <th className="px-2 py-1 text-right w-20">{t('simulator.rate')}</th>
                        <th className="px-2 py-1 text-right w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {outputs.map((output, idx) => {
                        const item = Object.values(ITEMS).find(i => i.id === output.itemId);
                        return (
                          <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-2 py-1.5">
                              <div className="flex items-center gap-2">
                                <img src={`${import.meta.env.BASE_URL}${item?.iconPath}`} alt="" className="w-5 h-5 object-contain shrink-0" />
                                <span className="font-bold text-slate-700 truncate">{getItemName(item)}</span>
                              </div>
                            </td>
                            <td className="px-2 py-1.5">
                              <div className="flex items-center justify-end">
                                <input 
                                  type="number" 
                                  value={output.rate}
                                  step="0.1"
                                  onChange={(e) => updateOutputRate(idx, parseFloat(e.target.value) || 0)}
                                  className="w-12 bg-transparent border-none text-right font-mono font-black text-orange-600 focus:ring-0 text-[10px] p-0"
                                />
                                <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                              </div>
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <button 
                                onClick={() => removeOutput(idx)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Processors Section */}
        <section id="processors-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsProcessorsOpen(!isProcessorsOpen)}
            className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center w-full hover:bg-slate-100 transition-colors"
          >
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Factory size={14} />
              {t('simulator.processors')}
            </h2>
            {isProcessorsOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </button>
          {isProcessorsOpen && (
            <div className="p-4 space-y-4">
              {/* Compact Add Processor UI */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">{t('simulator.item')}</label>
                    <button 
                      onClick={() => openModal('processor_item')}
                      className="w-full flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 transition-all group shadow-sm"
                    >
                      <div className="w-6 h-6 bg-slate-50 rounded p-1 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform flex items-center justify-center shrink-0">
                        {selectedProduceItem ? (
                          <img src={`${import.meta.env.BASE_URL}${selectedProduceItem.iconPath}`} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Package size={12} className="text-slate-300" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className={`text-[10px] font-bold ${selectedProduceItem ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                          {selectedProduceItem ? getItemName(selectedProduceItem) : t('simulator.select')}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">{t('itemDetail.facility')}</label>
                    <div className="flex flex-wrap gap-1.5 items-center py-1.5">
                      {availableFacilities.length > 0 ? availableFacilities.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedFacilityId(item.id)}
                          className={`group relative w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                            selectedFacilityId === item.id 
                              ? 'bg-blue-600 border-2 border-blue-400 shadow-md scale-110' 
                              : 'bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                          title={getItemName(item)}
                        >
                          <img src={`${import.meta.env.BASE_URL}${item.iconPath}`} alt="" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
                        </button>
                      )) : selectedProduceItemId ? (
                        <p className="text-[8px] font-bold text-slate-400 p-2 italic">
                          {t('simulator.noFacility')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {availableRecipes.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                      {t('itemDetail.productionRecipe')}
                    </label>
                    
                    <div className="grid grid-cols-1 gap-1.5">
                      {availableRecipes.map(recipe => {
                        return (
                          <div
                            key={recipe.id}
                            className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 bg-white shadow-sm"
                          >
                            <div className="flex-grow flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {recipe.ingredients.map(ing => {
                                  const ingItem = Object.values(ITEMS).find(i => i.id === ing.itemId);
                                  return (
                                    <div key={ing.itemId} className="relative">
                                      <img src={`${import.meta.env.BASE_URL}${ingItem?.iconPath}`} alt="" className="w-4 h-4 object-contain" title={getItemName(ingItem)} />
                                      <span className="absolute -bottom-1 -right-1 text-[6px] font-black bg-white/90 text-slate-700 px-0.5 rounded leading-none border border-slate-100">{ing.count}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <ArrowRight size={10} className="text-slate-300" />
                              <div className="flex items-center gap-0.5">
                                {[
                                  { itemId: recipe.outputItemId, count: recipe.outputCount },
                                  ...(recipe.extraOutputs || []).map(e => ({ itemId: e.itemId, count: e.count }))
                                ].map((out, i) => {
                                  const outItem = Object.values(ITEMS).find(i => i.id === out.itemId);
                                  return (
                                    <div key={`${out.itemId}-${i}`} className="relative">
                                      <img src={`${import.meta.env.BASE_URL}${outItem?.iconPath}`} alt="" className="w-4 h-4 object-contain" title={getItemName(outItem)} />
                                      <span className="absolute -bottom-1 -right-1 text-[6px] font-black bg-white/90 text-slate-700 px-0.5 rounded leading-none border border-slate-100">{out.count}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="text-[8px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                              {recipe.time}s
                            </div>

                            <button 
                              onClick={() => addProcessor(recipe.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-lg shadow-md shadow-blue-100 transition-all active:scale-95 shrink-0"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Processors Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full border-collapse text-[10px]">
                  <thead className="text-slate-400 font-black uppercase tracking-tighter border-b border-slate-100">
                    <tr>
                      <th className="px-2 py-1 text-left">{t('itemDetail.facility')}</th>
                      <th className="px-2 py-1 text-center">{t('itemDetail.productionRecipe')}</th>
                      <th className="px-2 py-1 text-right w-20">{t('simulator.production')}</th>
                      <th className="px-2 py-1 text-right w-24">{t('simulator.count')}</th>
                      <th className="px-2 py-1 text-right w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {processors.map((proc, idx) => {
                      const recipe = RECIPES.find(r => r.id === proc.recipeId);
                      const facilityItem = Object.values(ITEMS).find(i => i.id === proc.facilityId);
                      const speed = facilityItem?.productionSpeed || 1;
                      const rate = recipe ? (recipe.outputCount * proc.count * speed) / recipe.time : 0;
                      
                      return (
                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-2">
                              <img src={`${import.meta.env.BASE_URL}${facilityItem?.iconPath}`} alt="" className="w-5 h-5 object-contain" />
                              <span className="font-bold text-slate-700 truncate max-w-[100px]">{getItemName(facilityItem)}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center justify-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {recipe?.ingredients.map(ing => {
                                  const ingItem = Object.values(ITEMS).find(i => i.id === ing.itemId);
                                  return (
                                    <img key={ing.itemId} src={`${import.meta.env.BASE_URL}${ingItem?.iconPath}`} alt="" className="w-4 h-4 object-contain opacity-50" title={getItemName(ingItem)} />
                                  );
                                })}
                              </div>
                              <ArrowRight size={8} className="text-slate-300" />
                              <div className="flex items-center gap-0.5">
                                {[
                                  { itemId: recipe?.outputItemId, count: recipe?.outputCount },
                                  ...(recipe?.extraOutputs || []).map(e => ({ itemId: e.itemId, count: e.count }))
                                ].map((out, i) => {
                                  const outItem = Object.values(ITEMS).find(i => i.id === out.itemId);
                                  return (
                                    <img key={`${out.itemId}-${i}`} src={`${import.meta.env.BASE_URL}${outItem?.iconPath}`} alt="" className="w-4 h-4 object-contain" title={getItemName(outItem)} />
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right">
                            <span className="font-mono font-bold text-green-600">+{rate.toFixed(2)}/s</span>
                          </td>
                          <td className="px-2 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <input 
                                type="number" 
                                value={proc.count}
                                onChange={(e) => updateProcessorCount(idx, parseInt(e.target.value) || 0)}
                                className="w-8 bg-transparent border-none text-right font-mono font-black text-blue-600 focus:ring-0 text-[10px] p-0"
                              />
                              <span className="text-[8px] font-black text-slate-400 uppercase">台</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right">
                            <button 
                              onClick={() => removeProcessor(idx)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="bg-slate-900 rounded-3xl text-white shadow-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} />
              {t('simulator.results')}
            </h2>
          </div>
          <div className="flex-grow overflow-x-auto">
            {sortedResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-500 space-y-4 py-12">
                <Calculator size={32} className="opacity-20" />
                <p className="text-xs font-bold text-center max-w-xs">{t('simulator.empty')}</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-[10px]">
                <thead className="bg-white/5 text-slate-400 font-black uppercase tracking-tighter text-center">
                  <tr>
                    <th className="px-4 py-2 text-left w-48 font-black">{t('simulator.item')}</th>
                    <th className="px-2 py-2 font-black">{t('simulator.inputRate')}</th>
                    <th className="px-2 py-2 font-black">{t('simulator.production')}</th>
                    <th className="px-2 py-2 font-black">{t('simulator.consumption')}</th>
                    <th className="px-2 py-2 font-black">{t('simulator.externalOutput')}</th>
                    <th className="px-4 py-2 text-right font-black">{t('simulator.netRate')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedResults.map((res) => {
                    const item = Object.values(ITEMS).find(i => i.id === res.id);
                    const isPositive = res.netRate > 0.0001;
                    const isNegative = res.netRate < -0.0001;
                    
                    return (
                      <tr key={res.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2">
                          <button 
                            onClick={() => handleResultItemClick(res.id)}
                            disabled={!producibleItemIds.has(res.id)}
                            className={`flex items-center gap-2 group/item text-left ${producibleItemIds.has(res.id) ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
                          >
                            <div className={`w-6 h-6 bg-white/10 rounded flex items-center justify-center p-1 shrink-0 ${producibleItemIds.has(res.id) ? 'group-hover/item:scale-110 group-hover/item:bg-white/20 transition-all' : ''}`}>
                              <img src={`${import.meta.env.BASE_URL}${item?.iconPath}`} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className={`font-bold truncate ${producibleItemIds.has(res.id) ? 'text-slate-100 group-hover/item:text-blue-400 transition-colors' : 'text-slate-400'}`}>
                              {getItemName(item)}
                              {producibleItemIds.has(res.id) && (
                                <Plus size={8} className="inline ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              )}
                            </span>
                          </button>
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-slate-300">
                          {res.input > 0 ? `+${res.input.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-green-400/70">
                          {res.production > 0 ? `+${res.production.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-red-400/70">
                          {res.consumption > 0 ? `-${res.consumption.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-2 py-2 text-center font-mono text-orange-400/70">
                          {res.sink > 0 ? `-${res.sink.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-mono font-black text-xs ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
                              {res.netRate > 0 ? '+' : ''}{res.netRate.toFixed(2)}/s
                            </span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">
                              {(res.netRate * 60).toFixed(1)}/min
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
