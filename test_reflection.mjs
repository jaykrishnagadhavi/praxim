import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qecndeotezledafcttbh.supabase.co';
const supabaseKey = 'sb_publishable_DhFawBQIndQnaVAdyi1w2w_rS-4xcjp';

async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/daily_reflections`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      user_id: '00000000-0000-0000-0000-000000000000',
      date: new Date().toISOString(),
      reflection_text: 'hello',
      fake_column: 1
    })
  });
  const data = await res.json();
  console.log("Insert Response:", data);
}

run();
