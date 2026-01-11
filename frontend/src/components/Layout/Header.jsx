import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Menu, X, Users, FileText, Clock, User, Calendar } from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const adminNav = [
    { path: '/admin', label: 'Dashboard', icon: Users },
    { path: '/admin/volunteers', label: 'Voluntarios', icon: Users },
    { path: '/admin/reports', label: 'Reportes', icon: FileText }
  ];

  const volunteerNav = [
    { path: '/volunteer', label: 'Asistencia', icon: Clock },
    { path: '/volunteer/profile', label: 'Perfil', icon: User },
    { path: '/volunteer/history', label: 'Historial', icon: Calendar }
  ];

  const navigation = user?.role === 'admin' ? adminNav : volunteerNav;

  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏥</span>
            <div>
              <h1 className="text-xl font-bold">Cruz Verde</h1>
              <p className="text-xs text-green-100">{user?.name}</p>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-green-700 rounded-lg transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden lg:flex items-center gap-4">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    location.pathname === item.path
                      ? 'bg-white text-green-600'
                      : 'hover:bg-green-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-green-700 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </nav>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 border-t border-green-500 pt-4">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    location.pathname === item.path
                      ? 'bg-white text-green-600'
                      : 'hover:bg-green-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-700 rounded-lg"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;