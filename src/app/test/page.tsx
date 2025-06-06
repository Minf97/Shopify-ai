import { createClient } from '@/lib/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
  const { data } = await supabase.from("user").select();
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}