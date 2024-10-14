"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Dashboard() {
    return (
        <div className="p-20">
            <SignInButton forceRedirectUrl="/dashboard" />
        </div>
    )
}