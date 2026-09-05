import { supabase } from "./supabase";

export async function searchMaterials(searchTerm) {
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .or(
      `material_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,specifications.ilike.%${searchTerm}%`
    );

  if (error) {
    console.error("Material search error:", error);
    return [];
  }

  return data;
}