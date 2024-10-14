import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
    const { userId }: { userId: string | null } = auth()
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        let { data: Balance, error } = await supabase
            .from('Balance')
            .select('*')
            .eq('userId', userId)

        return new Response(JSON.stringify(Balance), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create payment link' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const { userId }: { userId: string | null } = auth()
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)

    var eth = 0;
    var bnb = 0;
    var pol = 0;

    try {
        let { data: PersonalBalance, error: PersonalError } = await supabase
            .from('PaymentLink')
            .select()
            .eq('payTo', String(userId))
            .eq('status', 'confirmed')
            .eq('type', 'personal')

            console.log("PersonalBalance length:", PersonalBalance.length)

        for (var i = 0; i < PersonalBalance.length; i++) {
            if (PersonalBalance[i].paidIn.split('|')[0].toLowerCase() === 'eth') {
                eth += PersonalBalance[i].cryptoAmount
            } else if (PersonalBalance[i].paidIn.split('|')[0].toLowerCase() === 'bnb') {
                bnb += PersonalBalance[i].cryptoAmount
            } else if (PersonalBalance[i].paidIn.split('|')[0].toLowerCase() === 'pol') {
                pol += PersonalBalance[i].cryptoAmount
            }
        }

        const personalBalances = {
            ETH: eth,
            BNB: bnb,
            POL: pol
        }

        eth = 0;
        bnb = 0;
        pol = 0;

        let { data: businessBalance, error: businessError } = await supabase
            .from('PaymentLink')
            .select()
            .eq('payTo', String(userId))
            .eq('status', 'confirmed')
            .eq('type', 'business')

            console.log("PersonalBalance length:", PersonalBalance.length)

        for (var i = 0; i < businessBalance.length; i++) {
            if (businessBalance[i].paidIn.split('|')[0].toLowerCase() === 'eth') {
                eth += businessBalance[i].cryptoAmount
            } else if (businessBalance[i].paidIn.split('|')[0].toLowerCase() === 'bnb') {
                bnb += businessBalance[i].cryptoAmount
            } else if (businessBalance[i].paidIn.split('|')[0].toLowerCase() === 'pol') {
                pol += businessBalance[i].cryptoAmount
            }
        }

        const businessBalances = {
            ETH: eth,
            BNB: bnb,
            POL: pol
        }

        console.log("Personal Balance [ETH, BNB, POL]: ", personalBalances);
        console.log("Business Balance [ETH, BNB, POL]: ", businessBalances);

        return new Response(JSON.stringify({personalBalances, businessBalances}), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create payment link' }), { status: 500 });
    }
}
