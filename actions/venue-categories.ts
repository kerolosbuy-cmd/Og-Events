"use server";

import { createClient } from "@/lib/supabase/server";

// Get the venue ID - you may need to adjust this based on your app logic
const VENUE_ID = "504317e9-1d2b-4928-a7ac-2589e12544cb";

export async function getVenueCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('venues')
    .select('categories')
    .eq('id', VENUE_ID)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Return categories filtered by visibility
  if (data && data.categories) {
    return data.categories.filter((category: any) => category.isVisible !== false);
  }

  return [];
}

