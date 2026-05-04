import { Link } from 'react-router-dom';
import { ITEMS } from '../data/items';
import { BUILDING_GRID, COMPONENT_GRID } from '../data/layouts';

export const ItemList = () => {
  const GridTable = ({ grid, title, icon, subtitle }: { grid: (string | null)[][], title: string, icon: string, subtitle: string }) => (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-xl">{icon}</span>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{title}</h2>
      </div>

      <div className="inline-block border border-slate-300 rounded overflow-hidden shadow-sm">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{subtitle}</span>
        </div>
        <div className="bg-white p-1">
          <table className="border-collapse">
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((itemId, colIndex) => {
                    if (itemId === null) {
                      return <td key={`${rowIndex}-${colIndex}`} className="w-12 h-12 border border-slate-100 bg-slate-50/50"></td>;
                    }
                    
                    const item = Object.values(ITEMS).find(i => i.id === itemId);
                    
                    return (
                      <td key={`${rowIndex}-${colIndex}`} className="p-0 border border-slate-200">
                        <Link
                          to={item ? `/item/${item.id}` : '#'}
                          className="group relative block w-12 h-12 hover:bg-blue-50 transition-colors flex items-center justify-center p-1"
                          title={item?.name || itemId}
                        >
                          {item?.iconPath ? (
                            <img src={item.iconPath} alt={item.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                          ) : (
                            <div className="text-[8px] text-slate-300 text-center leading-tight overflow-hidden px-1">{item?.name || itemId}</div>
                          )}
                          {item && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30 shadow-xl">
                              {item.name}
                            </div>
                          )}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 bg-white min-h-screen">
      <nav className="mb-6 flex gap-2 text-xs">
        <Link to="/" className="text-blue-600 hover:underline">Main Menu</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-bold uppercase tracking-widest">Items</span>
      </nav>

      <div className="space-y-20">
        <GridTable 
          grid={COMPONENT_GRID} 
          title="Components" 
          icon="⚙️" 
          subtitle="Materials & Resources" 
        />
        
        <GridTable 
          grid={BUILDING_GRID} 
          title="Buildings" 
          icon="🏭" 
          subtitle="Logistics & Production Facilities" 
        />
      </div>
    </div>
  );
};
