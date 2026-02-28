import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, Settings, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currency, toggleCurrency } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Табло' },
    { path: '/revenue', icon: PlusCircle, label: 'Приходи' },
    { path: '/documents', icon: FileText, label: 'Документи' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20 md:pb-0 md:pl-20">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-neon-green font-bold text-xl">
          <Dumbbell className="w-6 h-6" />
          <span>FitTax</span>
        </div>
        <button 
          onClick={toggleCurrency}
          className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-mono border border-zinc-700 hover:border-neon-green transition-colors"
        >
          {currency}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-20 bg-zinc-900 border-r border-zinc-800 flex-col items-center py-6 z-50">
        <div className="text-neon-green mb-8">
          <Dumbbell className="w-8 h-8" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-6 w-full px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-neon-green/10 text-neon-green' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={toggleCurrency}
          className="mt-auto mb-4 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono border border-zinc-700 hover:border-neon-green transition-colors"
        >
          {currency}
        </button>
      </aside>

      {/* Main Content */}
      <main className="pt-20 px-4 md:pt-8 md:px-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-neon-green' : 'text-zinc-500'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-current/20' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
