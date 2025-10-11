import { supabase } from "@/supabase-client";

// Database model types matching Supabase schema
export interface DBMaterial {
  id: number;
  created_at: string;
  name: string | null;
  weight: number | null;
  cost: number | null;
}

export interface DBDesign {
  design_id: number;
  description: string | null;
  font: string | null;
  cost: string | null;
  colour: string | null;
  hex_code: string | null;
}

export interface DBCoating {
  coating_id: number;
  colour: string | null;
  hex_code: string | null;
  type: string | null;
}

export interface DBEngraving {
  engraving_id: number;
  font: string | null;
  type_name: string | null;
  description: string | null;
  cost: string | null;
}

export interface DBCapConfig {
  cap_type_id: number;
  description: string | null;
  material_id: number | null;
  design_id: number | null;
  engraving_id: number | null;
  coating_id: number | null;
  cost: number | null;
  clip_design: number | null;
}

export interface DBBarrelConfig {
  barrel_id: number;
  design_id: number | null;
  engraving_id: number | null;
  grip_type: string | null;
  coating_id: number | null;
  cost: string | null;
  shape: string | null;
  description: string | null;
  material_id: number | null;
}

export interface DBNibConfig {
  nibtype_id: number;
  description: string | null;
  size: string | null;
  material_id: number | null;
  design_id: number | null;
  cost: string | null;
}

export interface DBInkConfig {
  ink_type_id: number;
  type_name: string;
  description: string | null;
  color_name: string | null;
  hexcode: string | null;
  cost: string | null;
}

export interface DBClipDesign {
  id: number;
  created_at: string;
  description: string | null;
  material: number | null;
  design: number | null;
  engraving: number | null;
  cost: string | null;
}

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// API Functions
export async function fetchMaterials(): Promise<DBMaterial[]> {
  const cacheKey = "materials";
  const cached = getCached<DBMaterial[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("Material")
      .select("*")
      .order("id");

    if (error) throw error;

    const materials = data || [];
    setCache(cacheKey, materials);
    return materials;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
}

export async function fetchDesigns(): Promise<DBDesign[]> {
  const cacheKey = "designs";
  const cached = getCached<DBDesign[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("Design")
      .select("*")
      .order("design_id");

    if (error) throw error;

    const designs = data || [];
    setCache(cacheKey, designs);
    return designs;
  } catch (error) {
    console.error("Error fetching designs:", error);
    return [];
  }
}

export async function fetchCoatings(): Promise<DBCoating[]> {
  const cacheKey = "coatings";
  const cached = getCached<DBCoating[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("Coating")
      .select("*")
      .order("coating_id");

    if (error) throw error;

    const coatings = data || [];
    setCache(cacheKey, coatings);
    return coatings;
  } catch (error) {
    console.error("Error fetching coatings:", error);
    return [];
  }
}

export async function fetchEngravings(): Promise<DBEngraving[]> {
  const cacheKey = "engravings";
  const cached = getCached<DBEngraving[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("Engravings")
      .select("*")
      .order("engraving_id");

    if (error) throw error;

    const engravings = data || [];
    setCache(cacheKey, engravings);
    return engravings;
  } catch (error) {
    console.error("Error fetching engravings:", error);
    return [];
  }
}

export async function fetchCapConfigs(): Promise<DBCapConfig[]> {
  const cacheKey = "capConfigs";
  const cached = getCached<DBCapConfig[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("CapConfig")
      .select("*")
      .order("cap_type_id");

    if (error) throw error;

    const capConfigs = data || [];
    setCache(cacheKey, capConfigs);
    return capConfigs;
  } catch (error) {
    console.error("Error fetching cap configs:", error);
    return [];
  }
}

export async function fetchBarrelConfigs(): Promise<DBBarrelConfig[]> {
  const cacheKey = "barrelConfigs";
  const cached = getCached<DBBarrelConfig[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("BarrelConfig")
      .select("*")
      .order("barrel_id");

    if (error) throw error;

    const barrelConfigs = data || [];
    setCache(cacheKey, barrelConfigs);
    return barrelConfigs;
  } catch (error) {
    console.error("Error fetching barrel configs:", error);
    return [];
  }
}

export async function fetchNibConfigs(): Promise<DBNibConfig[]> {
  const cacheKey = "nibConfigs";
  const cached = getCached<DBNibConfig[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("NibConfig")
      .select("*")
      .order("nibtype_id");

    if (error) throw error;

    const nibConfigs = data || [];
    setCache(cacheKey, nibConfigs);
    return nibConfigs;
  } catch (error) {
    console.error("Error fetching nib configs:", error);
    return [];
  }
}

export async function fetchInkConfigs(): Promise<DBInkConfig[]> {
  const cacheKey = "inkConfigs";
  const cached = getCached<DBInkConfig[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("InkConfig")
      .select("*")
      .order("ink_type_id");

    if (error) throw error;

    const inkConfigs = data || [];
    setCache(cacheKey, inkConfigs);
    return inkConfigs;
  } catch (error) {
    console.error("Error fetching ink configs:", error);
    return [];
  }
}

export async function fetchClipDesigns(): Promise<DBClipDesign[]> {
  const cacheKey = "clipDesigns";
  const cached = getCached<DBClipDesign[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("ClipDesign")
      .select("*")
      .order("id");

    if (error) throw error;

    const clipDesigns = data || [];
    setCache(cacheKey, clipDesigns);
    return clipDesigns;
  } catch (error) {
    console.error("Error fetching clip designs:", error);
    return [];
  }
}

// Utility function to clear cache (useful for refresh)
export function clearConfigCache(): void {
  cache.clear();
}

// Fetch all data at once for initial load
export async function fetchAllConfigData() {
  const [
    materials,
    designs,
    coatings,
    engravings,
    capConfigs,
    barrelConfigs,
    nibConfigs,
    inkConfigs,
    clipDesigns,
  ] = await Promise.all([
    fetchMaterials(),
    fetchDesigns(),
    fetchCoatings(),
    fetchEngravings(),
    fetchCapConfigs(),
    fetchBarrelConfigs(),
    fetchNibConfigs(),
    fetchInkConfigs(),
    fetchClipDesigns(),
  ]);

  return {
    materials,
    designs,
    coatings,
    engravings,
    capConfigs,
    barrelConfigs,
    nibConfigs,
    inkConfigs,
    clipDesigns,
  };
}
