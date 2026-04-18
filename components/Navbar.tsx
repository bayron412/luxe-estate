import React from 'react';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';

export default function Navbar({ dict, lang = 'es' }: { dict?: any, lang?: string }) {
  return (
    <nav className="sticky top-0 z-50 bg-[#EEF6F6]/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
                <span className="material-icons text-white text-lg">apartment</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">{dict?.buy || 'Buy'}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{dict?.rent || 'Rent'}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{dict?.sell || 'Sell'}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{dict?.savedHomes || 'Saved Homes'}</a>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#EEF6F6]"></span>
            </button>
            
            <UserMenu />

            <div className="pl-2 border-l border-nordic-dark/10 h-8 flex items-center">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-nordic-dark/5 bg-[#EEF6F6] overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{dict?.buy || 'Buy'}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{dict?.rent || 'Rent'}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{dict?.sell || 'Sell'}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{dict?.savedHomes || 'Saved Homes'}</a>
        </div>
      </div>
    </nav>
  );
}
