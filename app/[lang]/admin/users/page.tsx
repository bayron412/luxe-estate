import React from "react";
import { getDictionary } from "../../../../lib/dictionary";
import { createClient } from "../../../../lib/supabase/server";
import UserRoleList from "./UserRoleList";
import Pagination from "../../../../components/Pagination/Pagination";

const PAGE_SIZE = 5;

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: "es" | "en" | "fr" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const currentPage = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : (pageParam ?? "1")));

  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: allUsers, error } = await supabase.rpc("get_users_with_roles");

  if (error) {
    console.error("Error fetching users:", error);
  }

  const totalCount = allUsers?.length || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;
  const users = allUsers?.slice(from, to) || [];

  return (
    <>
      <header className="w-full pt-8 pb-6">
        <div className="animate-fade-in-down">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-nordic tracking-tight">
                {dict.admin.adminUsers}
              </h1>
              <p className="text-gray-500 mt-1">{dict.admin.manageAccess}</p>
            </div>
            <div className="relative flex-1 max-w-md w-full">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white text-nordic shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="Search by name, email..."
                type="text"
              />
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-white hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap">
              <span className="material-icons text-lg mr-2">add</span>
              Add User
            </button>
          </div>
        </div>
        <div className="mt-8 flex gap-6 border-b border-gray-200 overflow-x-auto">
          <button className="pb-3 text-sm font-semibold text-primary border-b-2 border-primary">All Users</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-nordic transition-colors">Agents</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-nordic transition-colors">Brokers</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-nordic transition-colors">Admins</button>
        </div>
      </header>

      <section className="w-full pb-12 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role & Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <UserRoleList initialUsers={users || []} dict={dict.admin} />
      </section>
      <footer className="mt-8 border-t border-gray-100 bg-white/50 py-6 rounded-b-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 gap-4">
          <p className="text-sm text-gray-500 font-medium">
            {dict.admin.showing} <span className="font-bold text-nordic">{from + 1}</span> {dict.admin.to}{" "}
            <span className="font-bold text-nordic">{Math.min(from + users.length, totalCount)}</span> {dict.admin.of}{" "}
            <span className="font-bold text-nordic">{totalCount}</span> {dict.admin.results}
          </p>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl={`/${lang}/admin/users`} 
          />
        </div>
      </footer>
    </>
  );
}
