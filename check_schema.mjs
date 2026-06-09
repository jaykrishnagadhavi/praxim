import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "d:/codebase/praxim/.env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase.from('daily_reflections').select('*').limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data schema:", data.length > 0 ? Object.keys(data[0]) : "No data, can't infer schema easily");
  }
}

main();
