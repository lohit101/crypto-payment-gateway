import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    const { userId }: { userId: string | null } = auth()
    const { amount, paymentUrl } = await req.json();
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    // Get the current domain (host) from the request headers
    const host = req.headers.get('host');
    var paymentId = randomUUID()

    try {
        const { data, error } = await supabase
            .from('PaymentLink')
            .insert([
                { id: paymentId, amount: parseFloat(amount), paymentUrl: `${paymentUrl}/payment/pay?id=${paymentId}`, expiresAt: expirationDate, status: 'pending', payTo: String(userId) },
            ])
            .select()

        return new Response(JSON.stringify(data), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create payment link' }), { status: 500 });
    }
}
