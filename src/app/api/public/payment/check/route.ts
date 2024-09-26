import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }


    let { data: PaymentLink, error } = await supabase
        .from('PaymentLink')  // or 'payment_link' based on your table name
        .select('*')          // Select all columns
        .eq('id', id)         // Filter where 'id' matches the value of 'id'

    if (!PaymentLink) {
        return NextResponse.json({ error: 'Payment link not found' }, { status: 404 });
    }

    const isExpired = new Date() > new Date(new Date(PaymentLink[0].expiresAt).getHours() + 1);
    // const isExpired = false;

    return NextResponse.json({ isExpired, PaymentLink });
}
