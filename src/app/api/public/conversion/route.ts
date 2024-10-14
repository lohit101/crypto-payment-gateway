import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { token } = await request.json();

    // Check for missing amount
    if (!token) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    try {
        const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${String(token)}`);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch ETH price');
        }

        const data = await response.json();

        // Return the calculated amount
        // return NextResponse.json(
        //     {
        //         amount: String(parseFloat(price) * parseFloat(amount)),
        //         userId: userId,
        //         callbackUrl: "",
        //         token: token,
        //     },
        //     { status: 200 }
        // );

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching price or processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
