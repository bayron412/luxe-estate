"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (locale: string) => {
    if (!pathname) return;
    
    const segments = pathname.split('/');
    if (segments.length >= 2) {
      segments[1] = locale; 
    }
    
    const newUrl = segments.join('/') || '/';
    
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000;`;
    
    router.push(newUrl);
    setIsOpen(false);
  };

  const locales = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
  ];

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-nordic-dark hover:text-mosque text-sm font-medium uppercase transition-colors px-2 py-1"
        aria-label="Seleccionar idioma"
      >
        <span className="material-icons text-[18px]">language</span>
        {currentLang}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-1 w-32 bg-white rounded-lg shadow-xl ring-1 ring-black/5 z-50">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLanguage(locale.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLang === locale.code ? 'text-mosque font-bold bg-mosque/5' : 'text-gray-700'}`}
            >
              {locale.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
