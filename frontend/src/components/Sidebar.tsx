import React, { useState } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  LayoutDashboard,
  TrendingUp,
  Image,
  FileText,
  Linkedin,
  Send,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Simulation', icon: TrendingUp, path: '/simulation' },
  { label: 'Brochure', icon: Image, path: '/brochure' },
  { label: 'Report', icon: FileText, path: '/report' },
  { label: 'LinkedIn', icon: Linkedin, path: '/linkedin' },
  { label: 'Auto-Post', icon: Send, path: '/autopost' },
  { label: 'Metrics', icon: BarChart3, path: '/metrics' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`
        flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out
        border-r border-white/[0.06] bg-[#080810]/80 backdrop-blur-2xl
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
            CoFoundrAI
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left group
                ${isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-slate-200'}`} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
