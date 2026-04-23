'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav aria-label="Properties pagination" className="flex items-center justify-center gap-1 mt-12">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}/?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-100 text-nordic hover:border-primary/30 hover:text-primary font-bold text-sm transition-all hover:shadow-md group"
          aria-label="Previous page"
        >
          <span className="material-symbols-rounded text-lg leading-none group-hover:-translate-x-1 transition-transform">chevron_left</span>
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-100 text-gray-300 font-bold text-sm cursor-not-allowed select-none">
          <span className="material-symbols-rounded text-lg leading-none">chevron_left</span>
          Prev
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-1">
        {pages.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-nordic-muted text-sm select-none"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={`${baseUrl}/?page=${page}`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                page === currentPage
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white border border-gray-100 text-nordic hover:border-primary/30 hover:text-primary hover:shadow-md'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={`${baseUrl}/?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-100 text-nordic hover:border-primary/30 hover:text-primary font-bold text-sm transition-all hover:shadow-md group"
          aria-label="Next page"
        >
          Next
          <span className="material-symbols-rounded text-lg leading-none group-hover:translate-x-1 transition-transform">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-100 text-gray-300 font-bold text-sm cursor-not-allowed select-none">
          Next
          <span className="material-symbols-rounded text-lg leading-none">chevron_right</span>
        </span>
      )}
    </nav>
  );
}

/** Generates the page numbers array with ellipsis where needed */
function getPaginationRange(current: number, total: number): (number | '...')[] {
  const delta = 2;
  const range: number[] = [];

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i);
  }

  const result: (number | '...')[] = [];

  if (range[0] > 1) {
    result.push(1);
    if (range[0] > 2) result.push('...');
  }

  result.push(...range);

  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) result.push('...');
    result.push(total);
  }

  return result;
}
