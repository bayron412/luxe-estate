import React from "react";
import { getDictionary } from "../../../../lib/dictionary";
import { createClient } from "../../../../lib/supabase/server";
import UserRoleList from "./UserRoleList";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ lang: "es" | "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: users, error } = await supabase.rpc("get_users_with_roles");

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <>
      <header className="w-full pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic">
              {dict.admin.users}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage user access and roles for your properties.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-gray-400 group-focus-within:text-primary text-xl">search</span>
              </div>
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
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-nordic">1</span> to{" "}
                <span className="font-medium text-nordic">{(users?.length || 0)}</span> of{" "}
                <span className="font-medium text-nordic">{(users?.length || 0)}</span> users
              </p>
            </div>
            <div>
              <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-none -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </button>
                <button className="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 shadow-sm">
                  1
                </button>
                <button className="bg-transparent text-gray-600 hover:bg-gray-100 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors">
                  2
                </button>
                <button className="bg-transparent text-gray-600 hover:bg-gray-100 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400">
                  ...
                </span>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Next</span>
                  <span className="material-icons text-xl">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
