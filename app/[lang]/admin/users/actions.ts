"use server";

import { createClient } from "../../../../lib/supabase/server";

export async function updateUserRoleAction(userId: string, targetRole: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.rpc("update_user_role", {
    p_id: userId,
    p_role: targetRole,
  });

  if (error) {
    console.error("Error updating role:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
