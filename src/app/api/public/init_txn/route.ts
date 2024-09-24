import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.json();
    const { product, price } = data;

    return NextResponse.json({ message: `Product: ${product}, Price: ${price}` });
}