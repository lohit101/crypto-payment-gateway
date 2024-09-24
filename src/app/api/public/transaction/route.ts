import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { userAccount } = await request.json();
    const { userId }: { userId: string | null } = auth()

    if (!userAccount) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    console.log(userAccount);
    return NextResponse.json(
        {
            userName: userAccount,
            userId: userId
        },
        {
            status: 200
        }
    );

};
