"use client";

import React, { useState, useEffect } from "react";
import { updateUserRoleAction } from "./actions";

interface User {
  id: string;
  email: string;
  raw_user_meta_data: any;
  role: string;
}

interface UserRoleListProps {
  initialUsers: User[];
  dict: any;
}

export default function UserRoleList({ initialUsers, dict }: UserRoleListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (userId: string, targetRole: string) => {
    setIsLoading(true);
    try {
      const result = await updateUserRoleAction(userId, targetRole);
      if (result.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u)));
        setActiveDropdownId(null);
      } else {
        alert("Error saving role: " + result.error);
      }
    } catch (e) {
      console.error(e);
      alert("Unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = (userId: string) => {
    if (activeDropdownId === userId) {
      setActiveDropdownId(null);
    } else {
      setActiveDropdownId(userId);
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const name = user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.name || user.email?.split("@")[0] || "User";
        const avatar = user.raw_user_meta_data?.avatar_url;
        const isSelected = activeDropdownId === user.id;
        const isAdmin = user.role === "admin";

        // Deterministic but "random-looking" numbers based on user ID to avoid hydration issues
        const propertiesCount = mounted ? (isAdmin ? "-" : Math.floor((user.id.charCodeAt(0) % 20) + 5)) : "-";
        const salesYTD = mounted ? (isAdmin ? "Level 5" : `$${((user.id.charCodeAt(1) % 50) / 10).toFixed(1)}M`) : "-";

        return (
          <div
            key={user.id}
            className={`user-card group relative rounded-xl p-5 shadow-sm border transition-all duration-200 flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
              isSelected 
                ? "bg-active-green border-transparent shadow-soft" 
                : "bg-white border-gray-100 hover:bg-active-green hover:border-transparent hover:shadow-soft"
            }`}
          >
            {/* User Details */}
            <div className="col-span-12 md:col-span-4 flex items-center w-full">
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {avatar ? (
                    <img src={avatar} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-gray-400 text-2xl">person</span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div className="ml-4 overflow-hidden">
                <div className="text-sm font-bold text-nordic truncate">{name}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
                <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-gray-50 rounded text-gray-400 group-hover:bg-white/50 transition-colors">
                  ID: #{user.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Role & Status */}
            <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                isAdmin 
                  ? "bg-nordic text-white" 
                  : "bg-primary/10 text-primary"
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <div className="flex items-center text-xs text-gray-400">
                <span className="material-icons text-[14px] mr-1 text-primary">check_circle</span>
                Active
              </div>
            </div>

            {/* Performance */}
            <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Properties</div>
                <div className="text-sm font-semibold text-nordic">
                  {propertiesCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Sales (YTD)</div>
                <div className="text-sm font-semibold text-nordic">
                  {salesYTD}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
              <button
                onClick={() => toggleDropdown(user.id)}
                className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg transition-all w-full md:w-auto justify-center ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : "border border-gray-200 bg-white text-nordic hover:bg-nordic hover:text-white"
                }`}
              >
                Change Role
                <span className={`material-icons text-[16px] ml-2 transition-transform duration-200 ${isSelected ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {isSelected && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-dropdown bg-primary ring-1 ring-black ring-opacity-5 overflow-hidden z-50 origin-top-right animate-fade-in-down">
                  <div className="py-1" role="menu">
                    {[
                      { id: "admin", label: "Administrator", icon: "shield" },
                      { id: "broker", label: "Broker", icon: "business_center" },
                      { id: "agent", label: "Agent", icon: "support_agent" },
                      { id: "viewer", label: "Viewer", icon: "visibility" },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleChange(user.id, role.id)}
                        disabled={isLoading}
                        className={`group flex items-center w-full px-4 py-3 text-xs transition-colors ${
                          user.role === role.id 
                            ? "text-white bg-white/20 font-medium" 
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                          {role.icon}
                        </span>
                        {role.label}
                      </button>
                    ))}
                    <div className="border-t border-white/10 my-1"></div>
                    <button className="group flex items-center w-full px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors">
                      <span className="material-icons text-sm mr-3 text-red-300 group-hover:text-red-100">block</span>
                      Suspend User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {users.length === 0 && (
        <div className="bg-white rounded-xl shadow-soft p-10 text-center text-gray-400 border border-gray-100">
          No users registered.
        </div>
      )}
    </div>
  );
}
