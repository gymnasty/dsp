import { ArrowDownToLine, ArrowRight, Calculator, ChevronDown, ChevronUp, Factory, Package, Plus, Save, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ItemSelectorModal } from '../components/ItemSelectorModal';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { ITEM_TYPES, InputState, OutputState, ProcessorState, SavedLayout } from '../types';
import { getItemName } from '../utils/i18n';

export const Simulator = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<InputState[]>([]);
  const [outputs, setOutputs] = useState<OutputState[]>([]);
  const [processors, setProcessors] = useState<ProcessorState[]>([]);
  const [loadedLayoutId, setLoadedLayoutId] = useState<string | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>(() => {
    const saved = localStorage.getItem('dsp_simulator_layouts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved layouts', e);
      }
    }
    return [];
  });

  // Load target layout if redirected from saved page
  useEffect(() => {
    const target = localStorage.getItem('dsp_simulator_load_target');
    if (target) {
      try {
        const layout: SavedLayout = JSON.parse(target);
        setInputs(layout.inputs);
        setOutputs(layout.outputs);
        setProcessors(layout.processors);
        setLoadedLayoutId(layout.id);
        // Clear it so it doesn't reload on next mount
        localStorage.removeItem('dsp_simulator_load_target');
      } catch (e) {
        console.error('Failed to parse load target', e);
      }
    }
  }, []);

  // Save layouts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dsp_simulator_layouts', JSON.stringify(savedLayouts));
  }, [savedLayouts]);

  const saveCurrentLayout = () => {
    if (inputs.length === 0 && outputs.length === 0 && processors.length === 0) return;
    
    if (loadedLayoutId) {
      const existingIndex = savedLayouts.findIndex(l => l.id === loadedLayoutId);
      if (existingIndex !== -1) {
        const existingLayout = savedLayouts[existingIndex];
        const newName = prompt(t('simulator.savePrompt'), existingLayout.name);
        if (newName === null) return; // User cancelled

        const updatedLayouts = [...savedLayouts];
        updatedLayouts[existingIndex] = {
          ...existingLayout,
          name: newName || '', // Can be empty
          timestamp: Date.now(),
          inputs,
          outputs,
          processors
        };
        setSavedLayouts(updatedLayouts);
        localStorage.setItem('dsp_simulator_layouts', JSON.stringify(updatedLayouts));
        navigate('/saved');
        return;
      }
    }

    const nameInput = prompt(t('simulator.savePrompt'), '');
    if (nameInput === null) return; // User cancelled
    const name = nameInput || '';

    const newId = crypto.randomUUID();
    const newLayout: SavedLayout = {
      id: newId,
      name,
      timestamp: Date.now(),
      inputs,
      outputs,
      processors
    };

    const updatedLayouts = [newLayout, ...savedLayouts];
    setSavedLayouts(updatedLayouts);
    setLoadedLayoutId(newId);
    localStorage.setItem('dsp_simulator_layouts', JSON.stringify(updatedLayouts));
    navigate('/saved');
  };

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
    const producibleIds = new Set<string>();
    RECIPES.forEach(r => {
      producibleIds.add(r.outputItemId);
      r.extraOutputs?.forEach(e => producibleIds.add(e.itemId));
    });
    return sortedItems.filter(item => producibleIds.has(item.id));
  }, [sortedItems]);

  const [selectedProduceItemId, setSelectedProduceItemId] = useState('');

  const availableFacilities = useMemo(() => {
    if (!selectedProduceItemId) return [];
    const recipes = RECIPES.filter(r => 
      r.outputItemId === selectedProduceItemId || 
      r.extraOutputs?.some(e => e.itemId === selectedProduceItemId)
    );
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

  // Menu State
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number; itemId: string } | null>(null);

  // Close menu when clicking elsewhere
  useEffect(() => {
    const handleWindowClick = () => setMenuAnchor(null);
    if (menuAnchor) {
      window.addEventListener('click', handleWindowClick);
    }
    return () => window.removeEventListener('click', handleWindowClick);
  }, [menuAnchor]);

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
      (r.outputItemId === selectedProduceItemId || r.extraOutputs?.some(e => e.itemId === selectedProduceItemId)) && 
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

  const addInput = (itemId?: string) => {
    const id = itemId || newItemId;
    if (!id) return;
    setInputs([...inputs, { itemId: id, rate: itemId ? 1 : newRate }]);
  };

  const updateInputRate = (index: number, rate: number) => {
    const nextInputs = [...inputs];
    nextInputs[index].rate = Math.max(0, rate);
    setInputs(nextInputs);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const addOutput = (itemId?: string) => {
    const id = itemId || newTargetItemId;
    if (!id) return;
    setOutputs([...outputs, { itemId: id, rate: itemId ? 1 : newTargetRate }]);
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

  const producibleItemIds = useMemo(() => {
    const ids = new Set<string>();
    RECIPES.forEach(r => {
      ids.add(r.outputItemId);
      r.extraOutputs?.forEach(e => ids.add(e.itemId));
    });
    return ids;
  }, []);

  const handleResultItemClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    
    const menuWidth = 180;
    const menuHeight = 120;
    
    let x = rect.left;
    let y = rect.bottom;
    
    // Adjust X if it would go off the right edge
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 16;
    }
    
    // Ensure X doesn't go off the left edge
    if (x < 16) x = 16;
    
    // Adjust Y if it would go off the bottom edge
    if (y + menuHeight > window.innerHeight) {
      y = rect.top - menuHeight;
    }
    
    setMenuAnchor({ x, y, itemId });
  };

  const jumpToProcessor = (itemId: string) => {
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
      <Breadcrumbs 
        items={[{ label: t('menu.simulator') }]} 
        extra={
          <div className="flex flex-wrap gap-2 justify-end">
            <button 
              onClick={() => { 
                if(confirm(t('simulator.clearConfirm'))) { 
                  setInputs([]); 
                  setOutputs([]); 
                  setProcessors([]); 
                  setNewItemId('');
                  setNewTargetItemId('');
                  setSelectedProduceItemId('');
                  setSelectedFacilityId('');
                  setLoadedLayoutId(null);
                } 
              }}
              className="px-3 md:px-4 py-1.5 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-200 rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">{t('simulator.clear')}</span>
            </button>
            <button 
              onClick={saveCurrentLayout}
              disabled={inputs.length === 0 && outputs.length === 0 && processors.length === 0}
              className="px-3 md:px-4 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 text-slate-600 border border-slate-200 rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Save size={14} />
              <span className="hidden sm:inline">{t('simulator.save')}</span>
            </button>
            <button 
              onClick={() => navigate('/saved')}
              disabled={savedLayouts.length === 0}
              className="px-3 md:px-4 py-1.5 bg-white hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 text-slate-600 border border-slate-200 rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Calculator size={14} />
              <span className="hidden sm:inline">{t('simulator.saved')}</span>
            </button>
          </div>
        }
      />

      <div className="space-y-6 md:space-y-8">
        {/* Config Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
                      step="1"
                      onChange={(e) => setNewRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-10 bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-[10px] p-1 text-blue-600"
                    />
                    <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                  </div>
                  <button 
                    onClick={() => addInput()}
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
                                  step="1"
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
                      step="1"
                      onChange={(e) => setNewTargetRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-10 bg-transparent border-none text-right font-mono font-bold focus:ring-0 text-[10px] p-1 text-orange-600"
                    />
                    <span className="text-[8px] font-black text-slate-400 ml-1 uppercase">/s</span>
                  </div>
                  <button
                    onClick={() => addOutput()}
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
                                  step="1"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">{t('simulator.item')}</label>
                    <button 
                      onClick={() => openModal('processor_item')}
                      className="w-full flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 h-10 transition-all group shadow-sm"
                    >
                      <div className="w-8 h-8 bg-slate-50 rounded-lg p-1.5 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform flex items-center justify-center shrink-0">
                        {selectedProduceItem ? (
                          <img src={`${import.meta.env.BASE_URL}${selectedProduceItem.iconPath}`} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Package size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className={`text-[10px] font-bold ${selectedProduceItem ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                          {selectedProduceItem ? getItemName(selectedProduceItem) : t('simulator.select')}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">{t('itemDetail.facility')}</label>
                    <div className="flex flex-wrap gap-2 items-center min-h-10">
                      {availableFacilities.length > 0 ? availableFacilities.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedFacilityId(item.id)}
                          className={`group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                            selectedFacilityId === item.id 
                              ? 'bg-white border-2 border-blue-600 shadow-md scale-110' 
                              : 'bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                          title={getItemName(item)}
                        >
                          <img src={`${import.meta.env.BASE_URL}${item.iconPath}`} alt="" className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" />
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
                    
                    <div className="grid grid-cols-1 gap-2">
                      {availableRecipes.map(recipe => {
                        return (
                          <div
                            key={recipe.id}
                            className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm"
                          >
                            <div className="flex-grow">
                              {/* Recipe Horizontal View with wrapping */}
                              <div className="flex items-center gap-3">
                                <div className="flex flex-wrap items-center gap-1.5 justify-start">
                                  {recipe.ingredients.map(ing => {
                                    const ingItem = Object.values(ITEMS).find(i => i.id === ing.itemId);
                                    return (
                                      <div key={ing.itemId} className="relative">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl p-1.5 border border-slate-100 flex items-center justify-center">
                                          <img src={`${import.meta.env.BASE_URL}${ingItem?.iconPath}`} alt="" className="w-full h-full object-contain" title={getItemName(ingItem)} />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-white shadow-sm text-slate-700 px-1.5 rounded-lg leading-none border border-slate-200">{ing.count}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                <ArrowRight size={14} className="text-slate-300 shrink-0" />
                                
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {[
                                    { itemId: recipe.outputItemId, count: recipe.outputCount },
                                    ...(recipe.extraOutputs || []).map(e => ({ itemId: e.itemId, count: e.count }))
                                  ].map((out, i) => {
                                    const outItem = Object.values(ITEMS).find(i => i.id === out.itemId);
                                    return (
                                      <div key={`${out.itemId}-${i}`} className="relative">
                                        <div className="w-10 h-10 bg-blue-50/50 rounded-xl p-1.5 border border-blue-100 flex items-center justify-center">
                                          <img src={`${import.meta.env.BASE_URL}${outItem?.iconPath}`} alt="" className="w-full h-full object-contain" title={getItemName(outItem)} />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-white shadow-sm text-blue-700 px-1.5 rounded-lg leading-none border border-blue-200">{out.count}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {(() => {
                                const facilitySpeed = Object.values(ITEMS).find(i => i.id === selectedFacilityId)?.productionSpeed || 1;
                                const actualTime = recipe.time / facilitySpeed;
                                const rate = (recipe.outputCount * facilitySpeed) / recipe.time;
                                return (
                                  <>
                                    <div className="text-[10px] font-mono font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100 whitespace-nowrap">
                                      {rate.toFixed(2)}/s
                                    </div>
                                    <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 whitespace-nowrap">
                                      {actualTime.toFixed(2)}s
                                    </div>
                                  </>
                                );
                              })()}
                            </div>

                            <button 
                              onClick={() => addProcessor(recipe.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95 shrink-0"
                            >
                              <Plus size={18} />
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
                      <th className="px-2 py-1 text-left">{t('itemDetail.productionRecipe')}</th>
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
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-1.5 shrink-0">
                                <img src={`${import.meta.env.BASE_URL}${facilityItem?.iconPath}`} alt="" className="w-full h-full object-contain" />
                              </div>
                              <span className="font-bold text-slate-700 leading-tight">{getItemName(facilityItem)}</span>
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex items-center justify-start gap-2">
                              {/* Ingredients */}
                              <div className="flex flex-wrap justify-start items-center gap-1.5 max-w-[120px]">
                                {recipe?.ingredients.map(ing => {
                                  const ingItem = Object.values(ITEMS).find(i => i.id === ing.itemId);
                                  return (
                                    <div key={ing.itemId} className="relative">
                                      <div className="w-8 h-8 bg-slate-50/50 rounded-lg p-1 border border-slate-100 opacity-60 flex items-center justify-center">
                                        <img src={`${import.meta.env.BASE_URL}${ingItem?.iconPath}`} alt="" className="w-full h-full object-contain" title={getItemName(ingItem)} />
                                      </div>
                                      <span className="absolute -bottom-1 -right-1 text-[7px] font-black bg-white shadow-sm text-slate-700 px-1 rounded-sm leading-none border border-slate-200">{ing.count}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              <ArrowRight size={12} className="text-slate-200 shrink-0" />
                              
                              {/* Outputs */}
                              <div className="flex flex-wrap justify-start items-center gap-1.5">
                                {[
                                  { itemId: recipe?.outputItemId, count: recipe?.outputCount },
                                  ...(recipe?.extraOutputs || []).map(e => ({ itemId: e.itemId, count: e.count }))
                                ].map((out, i) => {
                                  const outItem = Object.values(ITEMS).find(i => i.id === out.itemId);
                                  return (
                                    <div key={`${out.itemId}-${i}`} className="relative">
                                      <div className="w-8 h-8 bg-blue-50/30 rounded-lg p-1 border border-blue-50 flex items-center justify-center">
                                        <img src={`${import.meta.env.BASE_URL}${outItem?.iconPath}`} alt="" className="w-full h-full object-contain" title={getItemName(outItem)} />
                                      </div>
                                      <span className="absolute -bottom-1 -right-1 text-[7px] font-black bg-white shadow-sm text-blue-700 px-1 rounded-sm leading-none border border-blue-100">{out.count}</span>
                                    </div>
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
        <section className="bg-slate-900 rounded-[2rem] md:rounded-3xl text-white shadow-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} />
              {t('simulator.results')}
            </h2>
          </div>
          <div className="flex-grow overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            {sortedResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-500 space-y-4 py-12">
                <Calculator size={32} className="opacity-20" />
                <p className="text-xs font-bold text-center max-w-xs">{t('simulator.empty')}</p>
              </div>
            ) : (
              <div className="min-w-[600px] md:min-w-0">
                <table className="w-full border-collapse text-[10px]">
                  <thead className="bg-white/5 text-slate-400 font-black uppercase tracking-tighter text-center">
                    <tr>
                      <th className="px-4 py-2 text-left w-48 font-black">{t('simulator.item')}</th>
                      <th className="px-4 py-2 text-left font-black w-24">{t('simulator.netRate')}</th>
                      <th className="px-2 py-2 font-black">{t('simulator.inputRate')}</th>
                      <th className="px-2 py-2 font-black">{t('simulator.production')}</th>
                      <th className="px-2 py-2 font-black">{t('simulator.consumption')}</th>
                      <th className="px-2 py-2 font-black">{t('simulator.externalOutput')}</th>
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
                              onClick={(e) => handleResultItemClick(e, res.id)}
                              className="flex items-center gap-2 group/item text-left cursor-pointer"
                            >
                              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center p-1 shrink-0 group-hover/item:scale-110 group-hover/item:bg-white/20 transition-all">
                                <img src={`${import.meta.env.BASE_URL}${item?.iconPath}`} alt="" className="w-full h-full object-contain" />
                              </div>
                              <span className="font-bold truncate text-slate-100 group-hover/item:text-blue-400 transition-colors">
                                {getItemName(item)}
                                <Plus size={8} className="inline ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col items-start">
                              <span className={`font-mono font-black text-xs ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
                                {res.netRate > 0 ? '+' : ''}{res.netRate.toFixed(2)}/s
                              </span>
                              <span className="text-[8px] font-bold text-slate-500 uppercase">
                                {(res.netRate * 60).toFixed(1)}/min
                              </span>
                            </div>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

      {menuAnchor && createPortal(
        <div 
          className="fixed z-[100] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden min-w-[140px] py-1"
          style={{ top: menuAnchor.y, left: menuAnchor.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { addInput(menuAnchor.itemId); setMenuAnchor(null); }}
            className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <Package size={12} className="text-blue-500" />
            {t('simulator.addToInputs')}
          </button>
          <button 
            onClick={() => { addOutput(menuAnchor.itemId); setMenuAnchor(null); }}
            className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <ArrowDownToLine size={12} className="text-orange-500" />
            {t('simulator.addToExternalOutput')}
          </button>
          {producibleItemIds.has(menuAnchor.itemId) && (
            <button 
              onClick={() => { jumpToProcessor(menuAnchor.itemId); setMenuAnchor(null); }}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors border-t border-slate-100"
            >
              <Factory size={12} className="text-green-500" />
              {t('simulator.addToProcessors')}
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
