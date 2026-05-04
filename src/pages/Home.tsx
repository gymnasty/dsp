import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center space-y-16">
      <div className="text-center">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic">
          Dyson Sphere Program <span className="text-blue-600 not-italic uppercase tracking-widest text-6xl">Tools</span>
        </h1>
      </div>

      <Link
        to="/items"
        className="group bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center max-w-sm w-full"
      >
        <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] mb-8 flex items-center justify-center text-7xl group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 shadow-inner border border-slate-100">
          📦
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Items</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Components and Buildings
        </p>
      </Link>
    </div>
  );
};
