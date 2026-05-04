import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';

export const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [targetCount, setTargetCount] = useState(1);
  
  // Find the current item using ID from the ITEMS object values
  const item = Object.values(ITEMS).find((i) => i.id === id);
  const itemRecipes = RECIPES.filter((r) => r.outputItemId === id);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const recipe = itemRecipes[selectedRecipeIndex];
  
  // Find items that use this item as an ingredient
  const usedIn = RECIPES.filter((r) => 
    r.ingredients.some((ing) => ing.itemId === id)
  );

  // Calculate total raw materials
  const getRawMaterials = (itemId: string, count: number, recipeIndex: number = 0): Record<string, number> => {
    const rList = RECIPES.filter((r) => r.outputItemId === itemId);
    const r = rList[recipeIndex] || rList[0];
    
    if (!r) {
      return { [itemId]: count };
    }

    const raw: Record<string, number> = {};
    const multiplier = Math.ceil(count / r.outputCount);

    r.ingredients.forEach((ing) => {
      const ingRaw = getRawMaterials(ing.itemId, ing.count * multiplier);
      Object.entries(ingRaw).forEach(([id, amount]) => {
        raw[id] = (raw[id] || 0) + amount;
      });
    });

    return raw;
  };

  const rawMaterials = id ? getRawMaterials(id, targetCount, selectedRecipeIndex) : {};
  const isRawMaterial = itemRecipes.length === 0;

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-400">Item not found</h2>
        <Link to="/items" className="text-blue-600 hover:underline mt-4 inline-block">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Link 
            to="/items" 
            className="text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-lg"
          >
            Items
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 px-1">{item.category}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 px-1">{item.name}</span>
        </div>

        {!isRawMaterial && (
          <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Quantity</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full font-bold transition-colors"
              >-</button>
              <input 
                type="number" 
                value={targetCount}
                onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-mono font-bold text-lg focus:outline-none"
              />
              <button 
                onClick={() => setTargetCount(targetCount + 1)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full font-bold transition-colors"
              >+</button>
            </div>
          </div>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Header - Mobile/Side */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner mb-6 border border-slate-100 overflow-hidden">
              <img src={item.iconPath} alt={item.name} className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.name}</h1>
          </div>
          
          {/* Total Raw Materials (Only if not a raw material itself) */}
          {!isRawMaterial && (
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Total Raw Materials
              </h2>
              <div className="space-y-4">
                {Object.entries(rawMaterials).map(([materialId, count]) => {
                  const materialItem = Object.values(ITEMS).find(i => i.id === materialId);
                  return (
                    <div key={materialId} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                          <img src={materialItem?.iconPath} alt={materialItem?.name} className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                          {materialItem?.name || materialId}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold text-green-400">x{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recipe Selector (if multiple) */}
          {itemRecipes.length > 1 && (
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {itemRecipes.map((r, index) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRecipeIndex(index)}
                  className={`flex-grow py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    selectedRecipeIndex === index 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Recipe {index + 1}: {r.producedIn}
                </button>
              ))}
            </div>
          )}

          {/* Recipe Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Production Recipe
              </h2>
              {recipe && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Facility</span>
                    <span className="text-sm font-bold text-slate-700">{recipe.producedIn}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Cycle Time</span>
                    <span className="text-sm font-bold text-slate-700">{recipe.time}s</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Time</span>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.ceil(targetCount / recipe.outputCount) * recipe.time}s
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8">
              {recipe ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recipe.ingredients.map((ing) => {
                      const ingItem = Object.values(ITEMS).find((i) => i.id === ing.itemId);
                      const multiplier = Math.ceil(targetCount / recipe.outputCount);
                      return (
                        <Link 
                          key={ing.itemId} 
                          to={`/item/${ing.itemId}`}
                          className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group"
                        >
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-50 group-hover:scale-110 transition-transform overflow-hidden">
                            <img src={ingItem?.iconPath} alt={ingItem?.name} className="w-8 h-8 object-contain" />
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-bold text-slate-700">{ingItem?.name || ing.itemId}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{ingItem?.category}</div>
                          </div>
                          <div className="text-lg font-black text-blue-600 font-mono text-right">
                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter">x{ing.count} base</div>
                            x{ing.count * multiplier}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 text-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">✨</div>
                        <div>
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Yield</div>
                          <div className="text-sm font-bold">{item.name}</div>
                        </div>
                      </div>
                      <div className="text-4xl font-black text-green-400">
                        x{recipe.outputCount * Math.ceil(targetCount / recipe.outputCount)}
                      </div>
                    </div>

                    {recipe.extraOutputs && recipe.extraOutputs.length > 0 && (
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Byproducts</div>
                        {recipe.extraOutputs.map((extra) => {
                          const extraItem = Object.values(ITEMS).find(i => i.id === extra.itemId);
                          const multiplier = Math.ceil(targetCount / recipe.outputCount);
                          return (
                            <div key={extra.itemId} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center p-0.5">
                                  <img src={extraItem?.iconPath} alt={extraItem?.name} className="w-5 h-5 object-contain" />
                                </div>
                                <span className="text-xs font-medium text-slate-300">{extraItem?.name}</span>
                              </div>
                              <span className="text-sm font-mono font-bold text-blue-400">
                                x{extra.count * multiplier}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <span className="text-4xl mb-4">⚒️</span>
                  <p className="font-bold">Raw Material / Resource</p>
                  <p className="text-xs">This item is gathered directly from the environment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Used In Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Consumed By
              </h2>
            </div>
            <div className="p-8">
              {usedIn.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {usedIn.map((r) => {
                    const outputItem = Object.values(ITEMS).find((i) => i.id === r.outputItemId);
                    const ingredient = r.ingredients.find(ing => ing.itemId === id);
                    return (
                      <Link
                        key={r.id}
                        to={`/item/${r.outputItemId}`}
                        className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-50 group-hover:scale-110 transition-transform overflow-hidden">
                          <img src={outputItem?.iconPath} alt={outputItem?.name} className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-bold text-slate-700">{outputItem?.name}</div>
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{outputItem?.category}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-400 uppercase block">Requires</span>
                          <span className="text-sm font-black text-indigo-600 font-mono">x{ingredient?.count}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 italic">
                  Not currently used in any complex manufacturing recipes.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
