import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Compass,
  Ticket,
  BrainCircuit,
  Filter,
  ShieldCheck,
  CheckSquare,
  BarChart3,
  Bell,
  UserCog,
  FileText,
  Settings,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, isAdmin, isSalesManager, isMarketingManager, isCustomer } = useAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/customers', label: 'Customers 360', icon: Users, show: !isCustomer },
    { to: '/journeys', label: 'Journey Timeline', icon: Compass },
    { to: '/tickets', label: 'Service Tickets', icon: Ticket },
    { to: '/ai-insights', label: 'AI Intelligence Hub', icon: BrainCircuit, show: !isCustomer },
    { to: '/segments', label: 'Segments & Outreach', icon: Filter, show: isAdmin || isMarketingManager },
    { to: '/consent-governance', label: 'Consent & NBA Queue', icon: ShieldCheck, show: !isCustomer },
    { to: '/model-outcomes', label: 'Model Outcomes', icon: CheckSquare, show: !isCustomer },
    { to: '/analytics', label: 'Reports & Analytics', icon: BarChart3, show: !isCustomer },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/users', label: 'User Directory', icon: UserCog, show: isAdmin },
    { to: '/audit-logs', label: 'Audit Trail', icon: FileText, show: isAdmin || isSalesManager || isMarketingManager },
    { to: '/settings', label: 'Settings', icon: Settings, show: isAdmin }
  ].filter(item => item.show !== false);

  return (
    <aside className="w-64 bg-white border-r border-aurum-200 flex flex-col justify-between flex-shrink-0 min-h-screen">
      <div>
        {/* Brand Logo & Luxury Crest */}
        <div className="p-6 border-b border-aurum-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-aurum-400 to-aurum-600 flex items-center justify-center text-white shadow-luxury">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-charcoal-900 tracking-tight leading-none">
              Aurum & Co.
            </h1>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-aurum-600 mt-1 block">
              AI Journey Orchestrator
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-aurum-400 text-white shadow-sm'
                      : 'text-charcoal-600 hover:bg-aurum-50 hover:text-charcoal-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Role Indicator */}
      <div className="p-4 m-4 bg-aurum-50/80 rounded-2xl border border-aurum-200/80 text-xs">
        <div className="font-serif font-bold text-charcoal-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-[11px] text-aurum-700 font-semibold uppercase mt-0.5">
          {user?.role?.replace(/_/g, ' ')}
        </div>
        <div className="text-[10px] text-charcoal-400 mt-1">
          PostgreSQL Relational DB • Gemini AI
        </div>
      </div>
    </aside>
  );
};
