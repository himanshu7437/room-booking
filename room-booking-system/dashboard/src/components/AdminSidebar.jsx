import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarDays, ClipboardList, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Rooms', href: '/rooms', icon: BedDouble },
  { name: 'Events', href: '/events', icon: CalendarDays },
  { name: 'Bookings', href: '/bookings', icon: ClipboardList },
];

export function AdminSidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-800 px-6">
          <span className="text-xl font-bold tracking-wider text-teal-400">HotelAdmin</span>
        </div>
        
        <nav className="flex flex-1 flex-col gap-1 p-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                  end={item.href === '/'}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          <div className="mt-auto items-end pt-4 border-t border-gray-800">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
