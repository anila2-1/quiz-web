// src/components/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  href: string;
}

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // ✅ Fixed: Properly typed throttle with spread operator
  const throttle = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout | undefined;

    return (...args: Parameters<T>) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        func(...args); // ✅ No .apply() — safe and clean
        timeoutId = undefined;
      }, delay);
    };
  };

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    const throttledCheckMobile = throttle(checkMobile, 100);

    checkMobile();
    window.addEventListener('resize', throttledCheckMobile);
    return () => window.removeEventListener('resize', throttledCheckMobile);
  }, []);

  const menuItems: MenuItem[] = [
    { key: "overview", label: "Overview", icon: "📊", href: "/dashboard" },
    { key: "withdrawals", label: "Withdrawals", icon: "💰", href: "/dashboard/withdrawals" },
    { key: "profile", label: "Profile", icon: "👤", href: "/dashboard/profile" },
  ];

  const handleNavigation = useCallback((href: string) => {
    try {
      router.push(href);
      if (isMobile) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [router, isMobile]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // Brand Header
  const BrandHeader = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold text-indigo-700">Dashboard</h2>
    </div>
  );

  // Menu Item Component
  const MenuItemComponent = ({ item }: { item: MenuItem }) => (
    <li key={item.key}>
      <button
        onClick={() => handleNavigation(item.href)}
        className={`group w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-300 rounded-xl
          ${
            pathname === item.href
              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border-r-4 border-indigo-600"
              : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-25 hover:scale-[1.02]"
          }
        `}
      >
        <span className="relative">
          {item.icon}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-400 to-pink-400 blur-sm rounded-full transition-opacity duration-300"></span>
        </span>
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  );

  const Navigation = () => (
    <nav className="mt-4 px-2">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <MenuItemComponent key={item.key} item={item} />
        ))}
        
        {/* Back to Home */}
        <li className="mt-6 px-6">
          <Link
            href="/"
            className="group flex items-center space-x-2 text-gray-500 hover:text-indigo-600 font-medium transition-all duration-300"
          >
            <span className="group-hover:translate-x-[-4px] transition-transform duration-300">←</span>
            <span>Back to Home</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg md:hidden"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>

        {/* Mobile Sidebar */}
        <div
          className={`fixed h-full w-full max-w-xs bg-white/95 backdrop-blur-lg shadow-xl border-r border-gray-200/60 dark:border-gray-800 dark:bg-gray-950/95 transition-transform duration-300 z-40 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <BrandHeader />
          <Navigation />
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="fixed h-full w-64 bg-white/90 backdrop-blur-lg shadow-xl border-r border-gray-200/60 dark:border-gray-800 dark:bg-gray-950/90 transition-all duration-300 z-40 transform translate-x-0">
      <BrandHeader />
      <Navigation />
    </div>
  );
}