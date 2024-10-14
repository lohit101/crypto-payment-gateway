import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
    const { userId }: { userId: string | null } = auth()
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        const { data: Balance, error: BalanceError } = await supabase
            .from('Balance')
            .select('*')
            .eq('userId', String(userId))

        if (Balance.length <= 0) {
            const { data: BalanceData, error: BalanceDataError } = await supabase
                .from('Balance')
                .insert([{ userId: String(userId) }])
                .select()
        }

        console.log(Balance);

        return new Response(JSON.stringify(Balance), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const { walletAddresses, user } = await req.json();
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (!user) {
        const { userId }: { userId: string | null } = auth()
        console.log(walletAddresses);

        const walletsData = {
            sepWallet: String(walletAddresses.sepWallet) === '' || String(walletAddresses.sepWallet) === 'null' ? null : String(walletAddresses.sepWallet),
            ethWallet: String(walletAddresses.ethWallet) === '' || String(walletAddresses.ethWallet) === 'null' ? null : String(walletAddresses.ethWallet),
            bnbWallet: String(walletAddresses.bnbWallet) === '' || String(walletAddresses.bnbWallet) === 'null' ? null : String(walletAddresses.bnbWallet),
            polWallet: String(walletAddresses.polWallet) === '' || String(walletAddresses.polWallet) === 'null' ? null : String(walletAddresses.polWallet),
            lineaWallet: String(walletAddresses.lineaWallet) === '' || String(walletAddresses.lineaWallet) === 'null' ? null : String(walletAddresses.lineaWallet)
        }

        try {
            const { data: BalanceData, error: BalanceError } = await supabase
                .from('Balance')
                .update(walletsData)
                .eq('userId', String(userId))
                .select()

            console.log(BalanceData);

            return new Response(JSON.stringify(BalanceData), { status: 201 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
        }
    } else {
        console.log(user);

        try {
            const { data: BalanceData, error: BalanceError } = await supabase
                .from('Balance')
                .select()
                .eq('userId', String(user))

            console.log(BalanceData);

            return new Response(JSON.stringify(BalanceData), { status: 201 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
        }
    }
}
