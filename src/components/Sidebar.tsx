'use client';

import { useState } from 'react';
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

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen flex flex-col bg-[#0B0F14] text-[#F9FAFB] border-r border-[#1F2933] shadow-2xl z-50 transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 w-56' : '-translate-x-full md:translate-x-0'}
        ${isExpanded ? 'md:w-56' : 'md:w-[60px]'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo/Brand */}
        <div className="flex h-14 items-center border-b border-[#1F2933] px-3 overflow-hidden">
          <Link href="/dashboard" className="flex items-center" onClick={closeMobileMenu}>
            <img 
              src={isExpanded || isMobileMenuOpen ? "/Logo.png" : "/Logo-shrink.png"}
              alt="Serendib AI Logo" 
              className={`object-contain transition-all duration-300 ${
                isExpanded || isMobileMenuOpen ? 'h-10 w-auto' : 'w-9 h-9'
              }`}
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  title={!isExpanded && !isMobileMenuOpen ? item.shortName : ''}
                  className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'bg-[#1F2933] text-[#F9FAFB]' 
                      : 'text-[#CBD5E1] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                    }`}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-[#22C55E]' : 'text-[#CBD5E1] group-hover:text-[#F9FAFB]'
                    }`}
                  />
                  <span className={`ml-3 truncate transition-all duration-300 ${
                    isExpanded || isMobileMenuOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  }`}>{item.shortName}</span>
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="mt-6 border-t border-[#1F2933] pt-3 space-y-0.5">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  title={!isExpanded && !isMobileMenuOpen ? item.shortName : ''}
                  className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'bg-[#1F2933] text-[#F9FAFB]' 
                      : 'text-[#CBD5E1] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                    }`}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-[#22C55E]' : 'text-[#CBD5E1] group-hover:text-[#F9FAFB]'
                    }`}
                  />
                  <span className={`ml-3 truncate transition-all duration-300 ${
                    isExpanded || isMobileMenuOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  }`}>{item.shortName}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t border-[#1F2933] px-3 py-3 transition-all duration-300 overflow-hidden ${
          isExpanded || isMobileMenuOpen ? 'opacity-100' : 'opacity-0 h-0 py-0 border-0'
        }`}>
          <div className="text-[10px] text-slate-500 text-center leading-relaxed">
            <p>AI-Powered Marketing</p>
            <p>Optimization Platform</p>
          </div>
        </div>
      </div>

      {/* Spacer — mirrors sidebar width so content auto-shifts right */}
      <div className={`hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out ${isExpanded ? 'w-56' : 'w-[60px]'}`} />
    </>
  );
}
