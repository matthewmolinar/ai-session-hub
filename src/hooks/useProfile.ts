import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile(username?: string) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (username) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();
        setProfile(data);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  const isOwn = user?.id === profile?.id;

  const updateProfile = async (updates: Partial<Pick<Profile, "username" | "display_name" | "bio" | "avatar_url">>) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (!error) await fetchProfile();
    return { error: error?.message };
  };

  return { profile, loading, isOwn, updateProfile, refetch: fetchProfile };
}
