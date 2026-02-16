'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChartBarIcon, 
  SparklesIcon, 
  MegaphoneIcon, 
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, shortName: 'Home' },
  { name: 'Marketing Strategy Recommender', href: '/dashboard/strategy', icon: ChartBarIcon, shortName: 'Strategy' },
  { name: 'Content Generator', href: '/dashboard/content', icon: SparklesIcon, shortName: 'Content' },
  { name: 'Campaign Performance Predictor', href: '/dashboard/campaigns', icon: MegaphoneIcon, shortName: 'Campaigns' },
  { name: 'AI Chatbot', href: '/dashboard/chat', icon: ChatBubbleLeftRightIcon, shortName: 'Chat' },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, shortName: 'Settings' },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon, shortName: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only on desktop (window width > 768px)
      if (window.innerWidth > 768 && e.clientX < 50) {
        setIsExpanded(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setIsExpanded(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1F2933] text-[#F9FAFB] rounded-lg border border-[#1F2933] hover:border-[#CBD5E1]/20 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Glassmorphism Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen flex flex-col bg-[#0B0F14] backdrop-blur-xl text-[#F9FAFB] border-r border-[#1F2933] shadow-2xl transition-all duration-300 ease-in-out z-50 
        ${isExpanded ? 'w-64' : 'w-16'}
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        md:w-auto`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo/Brand */}
        <div className="flex h-16 items-center justify-start border-b border-[#1F2933] px-4">
        <Link href="/dashboard" className="flex items-center" onClick={closeMobileMenu}>
          <img 
            src={isExpanded || isMobileMenuOpen ? "/Logo.png" : "/Logo-shrink.png"}
            alt="Serendib AI Logo" 
            className={`object-contain transition-all duration-300 ${
              isExpanded || isMobileMenuOpen ? 'h-12 w-auto' : 'w-10 h-10'
            }`}
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-[#1F2933] text-[#F9FAFB] shadow-lg' 
                    : 'text-[#CBD5E1] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                  }
                `}
              >
                <item.icon
                  className={`flex-shrink-0 h-5 w-5 transition-all ${
                    isExpanded || isMobileMenuOpen ? 'mr-3' : 'mr-0'
                  } ${
                    isActive ? 'text-[#22C55E]' : 'text-[#CBD5E1] group-hover:text-[#F9FAFB]'
                  }`}
                />
                <span className={`truncate transition-all duration-300 ${
                  isExpanded || isMobileMenuOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:opacity-100 md:w-auto'
                }`}>{item.shortName}</span>
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-8 border-t border-[#1F2933] pt-4 space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-[#1F2933] text-[#F9FAFB] shadow-lg border border-[#1F2933]' 
                    : 'text-[#CBD5E1] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                  }
                `}
                title={!isExpanded && !isMobileMenuOpen ? item.shortName : ''}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 transition-all ${
                    isExpanded || isMobileMenuOpen ? 'mr-3' : 'mr-0'
                  } ${
                    isActive ? 'text-[#22C55E]' : 'text-[#CBD5E1] group-hover:text-[#F9FAFB]'
                  }`}
                />
                <span className={`truncate transition-all duration-300 ${
                  isExpanded || isMobileMenuOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:opacity-100 md:w-auto'
                }`}>{item.shortName}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1F2933] p-4">
        <div className={`text-xs text-[#CBD5E1] text-center transition-all duration-300 ${
          isExpanded || isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <p>AI-Powered Marketing</p>
          <p className="text-[#CBD5E1]/70">Optimization Platform</p>
        </div>
      </div>
    </div>

    {/* Spacer to prevent content overlap when sidebar is hidden */}
    <div className="w-0 md:w-16 flex-shrink-0" />
    </>
  );
}
