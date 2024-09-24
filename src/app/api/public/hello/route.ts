import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Hello from API' });
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    const { name } = data;

    return NextResponse.json({ message: `Hello from API, ${name}` });
}