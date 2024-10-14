import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    const { paymentId, paidBy, paidIn, cryptoAmount } = await req.json();
    const supabaseUrl = 'https://ogmkxjkzdojjwwseivju.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbWt4amt6ZG9qand3c2Vpdmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNTg1MDcsImV4cCI6MjA0MjgzNDUwN30.fYI0rYpE0gQhjDfnyuwsvGzgZigxlI2Y6SUZ9dOxv4Y'
    const supabase = createClient(supabaseUrl, supabaseKey)
    const toUpdate = String(paidIn.split('|')[1].toLowerCase() + "Balance");

    try {
        const { data: PaymentLink, error: PaymentLinkError } = await supabase
            .from('PaymentLink')
            .update({ status: 'confirmed', paidBy: String(paidBy), paidIn: String(paidIn), cryptoAmount: String(cryptoAmount) })
            .eq('id', String(paymentId))
            .select()

        const { data: OldBalance, error: OldBalanceError } = await supabase
            .from('Balance')
            .select('*')
            .eq('userId', String(PaymentLink[0].payTo))

        const balances = {
            'sepBalance': OldBalance[0]['sepBalance'],
            'ethBalance': OldBalance[0]['ethBalance'],
            'bnbBalance': OldBalance[0]['bnbBalance'],
            'polBalance': OldBalance[0]['polBalance'],
            'lineaBalance': OldBalance[0]['lineaBalance'],
        }

        balances[String(toUpdate)] = String(Number(parseFloat(balances[String(toUpdate)])) + Number(parseFloat(cryptoAmount)));

        const { data: NewBalance, error: NewBalanceError } = await supabase
            .from('Balance')
            .update({ sepBalance: balances['sepBalance'], ethBalance: balances['ethBalance'], bnbBalance: balances['bnbBalance'], polBalance: balances['polBalance'], lineaBalance: balances['lineaBalance'],  })
            .eq('userId', String(PaymentLink[0].payTo))
            .select()

        return new Response(JSON.stringify(PaymentLink), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
    }
}
