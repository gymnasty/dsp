import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Dyson Sphere Program <span className="text-blue-600">Manager</span>
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link to="/items" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Items</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            Dyson Sphere Program Manager &copy; 2026
          </p>
        </div>
      </footer>
    </div>
  );
};
