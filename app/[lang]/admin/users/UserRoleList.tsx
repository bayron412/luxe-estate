"use client";

import React, { useState } from "react";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setSelectedRole(user.role);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setSelectedRole("");
  };

  const handleSaveClick = async (userId: string) => {
    setIsLoading(true);
    try {
      const result = await updateUserRoleAction(userId, selectedRole);
      if (result.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: selectedRole } : u)));
        setEditingId(null);
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

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-[#EEF6F6]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-mosque/5 text-mosque border-b border-[#EEF6F6] text-sm">
              <th className="px-6 py-4 font-semibold">{dict.email}</th>
              <th className="px-6 py-4 font-semibold">{dict.role}</th>
              <th className="px-6 py-4 font-semibold text-right">{dict.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF6F6]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#EEF6F6]/30 transition-colors">
                <td className="px-6 py-4 text-sm text-nordic-dark font-medium">
                  {user.email || user.raw_user_meta_data?.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingId === user.id ? (
                    <select
                      className="border border-[#D9ECC8] rounded-md px-2 py-1 text-sm bg-white text-nordic-dark focus:outline-none focus:ring-2 focus:ring-mosque/50"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="user">{dict.user}</option>
                      <option value="admin">{dict.admin}</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? dict.admin : dict.user}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSaveClick(user.id)}
                        disabled={isLoading}
                        className="text-white bg-mosque px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-mosque/90 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? "..." : dict.save}
                      </button>
                      <button
                        onClick={handleCancelClick}
                        disabled={isLoading}
                        className="text-nordic-dark bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {dict.cancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-nordic-dark/50 hover:text-mosque transition-colors p-2 rounded-full hover:bg-mosque/10"
                      title={dict.editRole}
                    >
                      <span className="material-icons text-sm">edit</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-nordic-dark/50">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
