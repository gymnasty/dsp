import { useParams, Link } from 'react-router-dom';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';

export const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const item = Object.values(ITEMS).find((i) => i.id === id);
  const recipe = RECIPES.find((r) => r.outputItemId === id);
  
  // Find items that use this item as an ingredient
  const usedIn = RECIPES.filter((r) => 
    r.ingredients.some((ing) => ing.itemId === id)
  );

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <nav>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-full">
          <span>&larr;</span>
          <span>Back to List</span>
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Header - Mobile/Side */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-50 rounded-3xl flex items-center justify-center text-6xl shadow-inner mb-6 border border-slate-100">
              📦
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.name}</h1>
            <div className="mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
              {item.category}
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-200">
            <h3 className="text-lg font-bold mb-2">Production Tip</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Ensure you have a consistent supply of {item.name} to maintain your Dyson Sphere progress.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="lg:col-span-2 space-y-8">
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
                </div>
              )}
            </div>
            
            <div className="p-8">
              {recipe ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recipe.ingredients.map((ing) => {
                      const ingItem = Object.values(ITEMS).find((i) => i.id === ing.itemId);
                      return (
                        <Link 
                          key={ing.itemId} 
                          to={`/item/${ing.itemId}`}
                          className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group"
                        >
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            📦
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-bold text-slate-700">{ingItem?.name || ing.itemId}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{ingItem?.category}</div>
                          </div>
                          <div className="text-lg font-black text-blue-600 font-mono">
                            x{ing.count}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">✨</div>
                      <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Yield Output</div>
                        <div className="text-sm font-bold">Total Units Created</div>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-green-400">
                      x{recipe.outputCount}
                    </div>
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
                    return (
                      <Link
                        key={r.id}
                        to={`/item/${r.outputItemId}`}
                        className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          📦
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-700">{outputItem?.name}</div>
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{outputItem?.category}</div>
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
