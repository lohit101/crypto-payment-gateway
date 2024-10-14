import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
    const { userId }: { userId: string | null } = auth()
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        let { data: PersonalData, error: PersonalError } = await supabase
            .from('PaymentLink')
            .select('*')
            .eq('payTo', String(userId))
            .eq('type', 'personal')
            .range(0, 9)
            .order('createdAt', { ascending: false })

        let { data: BusinessData, error: BusinessError } = await supabase
            .from('PaymentLink')
            .select('*')
            .eq('payTo', String(userId))
            .eq('type', 'business')
            .eq('status', 'confirmed')
            .range(0, 9)
            .order('createdAt', { ascending: false })

        return new Response(JSON.stringify({PersonalData, BusinessData}), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create payment link' }), { status: 500 });
    }
}
