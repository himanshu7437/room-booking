import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export function TopHeader({ setSidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button 
        variant="ghost" 
        size="icon" 
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden lg:block">
              <span className="text-sm font-medium text-gray-700 block leading-tight">{user?.email || 'Admin User'}</span>
              <span className="text-xs text-gray-500 block">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
