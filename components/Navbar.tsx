import React from 'react';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';

export default function Navbar({ dict, lang = 'es' }: { dict?: any, lang?: string }) {
  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <div className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <span className="material-symbols-rounded text-white text-2xl">real_estate_agent</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-nordic">LuxeEstate</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a className="text-primary font-bold text-sm border-b-2 border-primary px-1 py-1" href="#">{dict?.buy || 'Buy'}</a>
            <a className="text-nordic/60 hover:text-nordic font-bold text-sm px-1 py-1 transition-all" href="#">{dict?.rent || 'Rent'}</a>
            <a className="text-nordic/60 hover:text-nordic font-bold text-sm px-1 py-1 transition-all" href="#">{dict?.sell || 'Sell'}</a>
            <a className="text-nordic/60 hover:text-nordic font-bold text-sm px-1 py-1 transition-all" href="#">{dict?.savedHomes || 'Saved Homes'}</a>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-nordic hover:text-primary transition-colors">
              <span className="material-symbols-rounded">search</span>
            </button>
            <button className="text-nordic hover:text-primary transition-colors relative">
              <span className="material-symbols-rounded">notifications</span>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            
            <UserMenu />

            <div className="pl-4 border-l border-nordic/10 h-8 flex items-center">
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
