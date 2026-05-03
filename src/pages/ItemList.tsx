import { Link } from 'react-router-dom';
import { ITEMS } from '../data/items';
import { Item } from '../types';

export const ItemList = () => {
  const components = Object.values(ITEMS).filter(item => item.category === 'Components');
  const buildings = Object.values(ITEMS).filter(item => item.category === 'Buildings');

  const ItemTable = ({ items, title, icon }: { items: Item[], title: string, icon: string }) => (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 px-2">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{title}</h2>
        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 tracking-widest ml-auto">
          {items.length} ITEMS
        </span>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-24">Icon</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-32 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform overflow-hidden">
                      {item.iconPath ? (
                        <img src={item.iconPath} alt={item.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/item/${item.id}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                      {item.id}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/item/${item.id}`} 
                      className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  No items registered in this section yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8 px-4">
      <nav className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <span>🏠</span>
          <span>Main Menu</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-black uppercase tracking-widest">Items</span>
        </Link>
      </nav>

      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">Production Directory</h1>
        <p className="text-lg text-slate-500 font-medium">Comprehensive table of all Dyson Sphere Program materials and facilities.</p>
      </div>

      <div className="space-y-20">
        <ItemTable items={components} title="Components" icon="⚙️" />
        <ItemTable items={buildings} title="Buildings" icon="🏭" />
      </div>
    </div>
  );
};
