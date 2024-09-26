// src/app/create_link/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";

export default function CreatePaymentLink() {
    const [amount, setAmount] = useState<string>("");
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // const router = useRouter();

    const createPaymentLink = async () => {
        setError(null);

        if (!amount) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            const response = await fetch("/api/public/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();

            console.log(data[0]);

            if (response.ok) {
                setPaymentLink(`${window.location.origin}/payment/pay?id=${data[0].id}`);
            } else {
                setError(data.error || "Something went wrong.");
            }
        } catch (err) {
            setError("Failed to create payment link.");
        }
    };

    return (
        <div>
            <h1>Create Payment Link</h1>
            <input
                type="text"
                placeholder="Amount in USD"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={createPaymentLink}>Create Link</button>

            {paymentLink && (
                <div>
                    <p>Payment link created and valid for 1 hour:</p>
                    <a href={paymentLink} target="_blank">{paymentLink}</a>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
