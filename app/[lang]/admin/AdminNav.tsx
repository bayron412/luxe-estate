"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavProps {
  lang: string;
  dict: {
    dashboard: string;
    properties: string;
    users: string;
  };
}

export default function AdminNav({ lang, dict }: AdminNavProps) {
  const pathname = usePathname();

  const links = [
    { href: `/${lang}/admin`, label: dict.dashboard },
    { href: `/${lang}/admin/properties`, label: dict.properties },
    { href: `/${lang}/admin/users`, label: dict.users },
  ];

  return (
    <div className="hidden md:flex space-x-8">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`${
              isActive
                ? "text-nordic border-b-2 border-primary"
                : "text-gray-500 border-b-2 border-transparent hover:text-primary hover:border-primary/30"
            } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
