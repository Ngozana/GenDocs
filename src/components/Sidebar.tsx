import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, History, FileText } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/create', icon: FilePlus, label: 'Ordre de mission' },
    { to: '/create-autorisation', icon: FileText, label: 'Autorisation d\'absence' },
    { to: '/create-proces-verbal', icon: FileText, label: 'Procès-Verbal' },
    { to: '/history', icon: History, label: 'Historique' },
  ];

  return (
    <aside className="w-64 bg-emerald-800 text-white flex flex-col h-full shadow-lg print:hidden">
      <div className="p-6 border-b border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg flex items-center justify-center w-10 h-10">
            <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Eaux & Forêts</h1>
            <p className="text-emerald-200 text-xs">Ordres de Mission</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-700">
        <div className="text-xs text-emerald-300 text-center">
          République de Côte d'Ivoire
        </div>
      </div>
    </aside>
  );
}
