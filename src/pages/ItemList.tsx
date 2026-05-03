import { Link } from 'react-router-dom';
import { ITEMS } from '../data/items';

export const ItemList = () => {
  const components = Object.values(ITEMS).filter(item => item.category === 'Components');
  const buildings = Object.values(ITEMS).filter(item => item.category === 'Buildings');

  const ItemGrid = ({ items, title, icon }: { items: any[], title: string, icon: string }) => (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{title}</h2>
        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 tracking-widest ml-auto">
          {items.length} ITEMS
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
            No items registered in this section yet.
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8">
      <nav className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
          <span>🏠</span>
          <span>Main Menu</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-black uppercase tracking-widest">Items</span>
        </Link>
      </nav>

      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic">Production Directory</h1>
        <p className="text-slate-500 font-medium">Comprehensive list of all items and facilities.</p>
      </div>

      <div className="space-y-20">
        <ItemGrid items={components} title="Components" icon="⚙️" />
        <ItemGrid items={buildings} title="Buildings" icon="🏭" />
      </div>
    </div>
  );
};
