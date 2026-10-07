"use client";

import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseReady = URL && KEY && URL.startsWith("https://");
export const supabase = supabaseReady
  ? createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

/* ---- AUTH ---- */
export async function signUp(email, password) {
  if (!supabase) return { error: "Supabase belum dikonfigurasi" };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error: error?.message };
}

export async function signIn(email, password) {
  if (!supabase) return { error: "Supabase belum dikonfigurasi" };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error: error?.message };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export function onAuthChange(cb) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session?.user || null));
  return () => data.subscription.unsubscribe();
}

/* ---- FAVORITES ---- */
export async function cloudGetFavorites(userId) {
  if (!supabase || !userId) return [];
  const { data } = await supabase.from("favorites").select("tool_id").eq("user_id", userId);
  return (data || []).map((x) => x.tool_id);
}

export async function cloudAddFavorite(userId, toolId) {
  if (!supabase || !userId) return;
  await supabase.from("favorites").upsert({ user_id: userId, tool_id: toolId }, { onConflict: "user_id,tool_id" });
}

export async function cloudRemoveFavorite(userId, toolId) {
  if (!supabase || !userId) return;
  await supabase.from("favorites").delete().eq("user_id", userId).eq("tool_id", toolId);
}

/* ---- HISTORY ---- */
export async function cloudAddHistory(userId, toolId, meta = {}) {
  if (!supabase || !userId) return;
  await supabase.from("history").insert({ user_id: userId, tool_id: toolId, meta });
}

export async function cloudGetHistory(userId, limit = 50) {
  if (!supabase || !userId) return [];
  const { data } = await supabase.from("history")
    .select("*").eq("user_id", userId)
    .order("created_at", { ascending: false }).limit(limit);
  return data || [];
}
