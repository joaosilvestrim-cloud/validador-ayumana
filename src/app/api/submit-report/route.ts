import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// These environment variables will be provided by Vercel or local .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing! The API will mock a successful response.");
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // If supabase is not configured, simulate success (MOCK MODE)
    if (!supabase) {
      console.log('--- MOCK SUBMISSION RECEIVED ---');
      console.log(JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, mock: true, message: 'Simulated persistence because Supabase vars are missing' });
    }

    const { error } = await supabase
      .from('test_reports')
      .insert([
        {
          volunteer_name: data.volunteer_name,
          volunteer_email: data.volunteer_email,
          profile: data.profile,
          checklist_results: data.checklist_results,
          general_feedback: data.feedback
        }
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
