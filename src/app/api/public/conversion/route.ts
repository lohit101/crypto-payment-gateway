import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { amount, token } = await request.json();
    const { userId }: { userId: string | null } = auth();

    // Check for missing amount
    if (!amount || !token) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    try {
        const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${String(token)}`);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch ETH price');
        }

        const data = await response.json();
        const price = data[String(token)];

        // Return the calculated amount
        return NextResponse.json(
            {
                amount: String(parseFloat(price) * parseFloat(amount)),
                userId: userId,
                callbackUrl: "",
                token: token,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching price or processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
