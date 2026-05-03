import { ITEMS } from '../data/items';
import { Link } from 'react-router-dom';

export const ItemList = () => {
  const itemList = Object.values(ITEMS);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Items</h1>
        <p className="text-slate-500 font-medium">Browse and manage production materials.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {itemList.map((item) => (
          <Link
            key={item.id}
            to={`/item/${item.id}`}
            className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              📦
            </div>
            <div className="text-center space-y-1">
              <div className="font-bold text-slate-800 leading-tight">{item.name}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-[10px]">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
