import { supabase } from "@/lib/supabase";

/**
 * Count unread messages for a user (messages where is_read = false
 * and the sender is not the current user).
 */
export async function countUnreadMessages(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false)
    .neq("sender_id", userId);

  if (error) {
    console.error("Error counting unread messages:", error);
    return 0;
  }
  return count ?? 0;
}

/**
 * Count new matches since the user last checked.
 * Looks for matches with status 'matched' where matched_at is after lastSeen.
 */
export async function countNewMatches(
  userId: string,
  lastSeen?: string
): Promise<number> {
  let query = supabase
    .from("matches")
    .select("id", { count: "exact", head: true })
    .eq("status", "matched")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);

  if (lastSeen) {
    query = query.gt("matched_at", lastSeen);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting new matches:", error);
    return 0;
  }
  return count ?? 0;
}
