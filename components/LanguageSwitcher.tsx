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
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const currentLocaleObj = locales.find(l => l.code === currentLang) || locales[0];

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-nordic-dark hover:text-mosque text-sm font-medium uppercase transition-colors px-2 py-1"
        aria-label="Seleccionar idioma"
      >
        <span className="text-base leading-none">{currentLocaleObj.flag}</span>
        {currentLang}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-1 w-36 bg-white rounded-lg shadow-xl ring-1 ring-black/5 z-50">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLanguage(locale.code)}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLang === locale.code ? 'text-mosque font-bold bg-mosque/5' : 'text-gray-700'}`}
            >
              <span className="text-base">{locale.flag}</span>
              {locale.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
