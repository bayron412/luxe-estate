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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-nordic-dark tracking-tight">
          {dict.admin.users}
        </h1>
      </div>

      <UserRoleList initialUsers={users || []} dict={dict.admin} />
    </div>
  );
}
