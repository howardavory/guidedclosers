'use client';
import { Home, BarChart2, Settings, LogOut, Calculator, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import useStore from '@/store/useStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar({ isSidebarOpen = true, setIsSidebarOpen, }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Strict Zustand selectors to prevent infinite re-renders
  const currentUser = useStore((state) => state.currentUser);
  const setActiveGlobalDrawer = useStore((state) => state.setActiveGlobalDrawer);
  
  const role = currentUser?.role || 'Setter';

  const toggleSidebar = () => {
    if (setIsSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Define nav items with strict access control tags
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['Setter', 'Closer', 'Manager', 'Admin'] },
    { name: 'Tear-Sheet', onClick: () => setActiveGlobalDrawer('tearsheet'), icon: FileText, roles: ['Setter', 'Closer', 'Manager', 'Admin'] },
    // Executive Only Tabs
    { name: 'Analytics', path: '/analytics', icon: BarChart2, roles: ['Manager', 'Admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Setter', 'Closer', 'Manager', 'Admin'] },
  ].filter(item => item.roles.includes(role)); // INSTANT SECURITY FILTER

  return (
    <aside className="sticky top-0 left-0 h-screen bg-black/40 backdrop-blur-md border-r border-[var(--brand-primary)]/20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col pt-8 pb-4 z-50 w-full overflow-hidden transition-all duration-300">
      
      {/* Brand */}
      <div className="mb-12 flex flex-col items-center justify-center w-full px-4">
        <div className={`mx-auto flex justify-center rounded-xl overflow-hidden shadow-sm transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full max-w-[180px] opacity-100' : 'w-0 opacity-0 h-0 mb-0'}`}>
          <img src="/logo.jpg" alt="Family Legacy Investment Group" className="w-full object-contain mix-blend-screen" />
        </div>
        <div className={`mt-2 flex items-center justify-center gap-2 bg-[var(--card-bg)] shadow-sm border border-[var(--brand-primary)]/20 rounded-full text-[var(--text-base)] text-xs font-bold transition-all duration-300 ease-in-out ${isSidebarOpen ? 'px-4 py-1.5 w-auto opacity-100' : 'w-8 h-8 p-0 px-0 opacity-100'}`}>
          <span className="w-2 h-2 flex-shrink-0 rounded-full bg-[var(--brand-primary)]" style={{ boxShadow: '0 0 8px var(--brand-primary)' }}></span>
          <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>Role: {role}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 px-4 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = item.path ? pathname === item.path : false;
          return item.onClick ? (
            <button key={item.name} onClick={item.onClick} className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl w-full transition-all group overflow-hidden whitespace-nowrap text-[var(--text-base)] font-medium hover:bg-[var(--brand-primary)]/10 hover:shadow-sm border border-transparent cursor-pointer`}>
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]`} />
              <span className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {item.name}
              </span>
            </button>
          ) : (
            <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl w-full transition-all group overflow-hidden whitespace-nowrap ${isActive ? 'bg-[var(--card-bg)] text-[var(--brand-primary)] border-r-2 border-[var(--brand-primary)] font-bold rounded-xl' : 'text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--card-bg)]'}`}>
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'}`} />
              <span className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-4 mt-auto mb-6 px-4">
        
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar} 
          className="w-full flex items-center justify-center py-2 text-[var(--text-muted)] hover:text-gray-200 transition-colors cursor-pointer"
        >
          {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        <button onClick={() => { useStore.getState().setCurrentUser(null); router.push('/login'); }} className={`w-full flex items-center px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-red-500 hover:bg-red-900/20 rounded-xl transition-all group overflow-hidden whitespace-nowrap ${!isSidebarOpen ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0 hidden'}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
