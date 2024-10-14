"use client";

import { useState } from "react";
import React from "react";

export default function CreatePaymentLink() {
    const [amount, setAmount] = useState<string>("");
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createPaymentLink = async (event) => {
        event.classList.add("btn-loading");
        setError(null);

        if (!amount) {
            setError("Please enter a valid amount.");
            event.classList.remove("btn-loading");
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
                event.classList.remove("btn-loading");
            }
        } catch (err) {
            setError("Failed to create payment link.");
            event.classList.remove("btn-loading");
        }
        event.classList.remove("btn-loading");
    };

    return (
        <div className="bg-white rounded-lg px-5 py-3 pb-4 shadow-2xl w-full h-max">
            <h1 className="font-bold mb-2 text-xl">Create Your Payment Link</h1>
            <div className="flex flex-row items-center gap-3 bg-gray-200 p-2 rounded-md">
                <div className="flex items-center bg-white rounded gap-1 h-[100%] w-2/3 px-2">
                    <p className="flex items-center justify-center font-bold">$</p>
                    <input
                        type="text"
                        placeholder="Amount in USD"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white text-sm p-2 w-full border-transparent outline-none focus:border-transparent focus:ring-0"
                    />
                </div>
                <button className="btn w-1/3 bg-black text-white py-2 px-4 rounded text-xs hover:bg-black/80 transition-all" onClick={(e) => createPaymentLink(e.target)}>Create Link</button>
            </div>

            {paymentLink && (
                <div className="bg-gray-200 p-3 rounded my-2">
                    <div className="flex h-max overflow-y-hidden">
                        <a className="w-[100%] max-w-[100%] bg-white after:content-['...'] overflow-y-hidden truncate py-1 px-2 rounded text-blue-500 underline" href={paymentLink} target="_blank">{paymentLink}</a>
                    </div>
                    <div className="flex flex-row gap-5 mt-3 w-full items-center justify-center">
                        <div className="flex items-center justify-center bg-black hover:bg-black/80 transition-all rounded-full w-6 h-6 aspect-square cursor-pointer">
                            <img className="h-4 invert" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHUlEQVR4nO2cTW4TQRCFnxHZI1hCtlwAsYAVbCEIkWSACyCxzhEgICQk/m4QQkDyIUAiZoUUdsFwC2IBOzdqVJYsy9PumYwnr+z3SbXx/PTUfG632z0uQAghRItcB/AGwCsA13TnT5anAIYAgsXQXhMnJCOUxAsZ4ZERJIVPRpAUPhlBUvhkBEnhkxEkhU9GkBQ+GUFS+GQESanH84yb+rvmtlHENkRDPeMbgIeJ7Q8AfFVPaU/GOQBFYp+47YykHI9nGTIOTAYyhMD2Pcg4b2xbjLFWUUaukCpSbowds/S8qyijipBcKW8njllqPsyQcXbKMVWEwM6RkvK+hTzdcK+ijDpCZkm5W3LM0vJ6YvXvY0JGXSGwc34a2ze2+XIO+SwEFwHcB3AlY9+6QiIdAFetrdimaIDiGELEHCgkhItCQrgoJISLQkK4KCSkPisANoH/P5F8BzBI3Mxui0K6iXMM7Fp3AWxYDgvBbQA/M37cC2RCJuMHgFtwTJx8PZmYfXsWEiyXbcttadbEu8RCRvEYDj+mhgssZGhrOC5YqThmeBQSbExxMdBvzkgkPhGybzdjWmy1KGQrcR37GU+vrMP56l9M8ryjecgFAD3vq4z9RM9oSkabE8Mo5U9JO3GeQk/ZpO+z45l6r6SdIzjguIM1o5DU4E+PhJAhIWRICBkSQoaEkCEhZEgIGRJChoSQISFkSAgZEkKGhJAhIWRIyJIK2Ui0Fbc1idZDMricEHIJzSIhGXRKllbjgxRNIyGZxP+f7wH4a7E35f/sTSAhFTllMS8khAwJIUNCyJAQMiSEDAkhQ0LIkBAyJIQMCSFDQsiQEDIkhAwJIUNCyJAQMiSEDAkhQ0LIcC3kKFFWwytfSnL6BeelNWKZCm+sei+tsZvo3j1nUlYTvSPGDhyQesQz2LutlyiL1CWJXqJnjOIOHHAawOGMRBYh+l4KmMGqd9Yt8RccRMztJpyxTXDjwpziERzSMSmL1FOGVpHUZZnYEWuJr8Keou/xYyo10K9bjcLDGaXGA0kM7Fp37NtUzEEIIYQQQgghhBBYJv4B+6PYBfcyMt0AAAAASUVORK5CYII=" />
                        </div>
                        <a href={paymentLink} className="flex items-center justify-center bg-black hover:bg-black/80 transition-all rounded-full w-6 h-6 aspect-square cursor-pointer">
                            <img className="h-3 invert" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADsklEQVR4nO2cS0hVURSGP3tZOYiCXhjSQAMJpEFBkZEagkaPQQQNi6TIoIgGgkE5iCZNhGjSJLIHYYOCwkGToqDHoCyoQDKsQYNAsoJKCzxxcF+4SN6H3nv2Ovf8H6zpZbs+99mvtTcIIYQQQgghhBBCCCGEmBblQDtwFTgHrJ7ez4hCsAB4CgRp8R1oLMivi7w5OklGKn5Kih96phAiKZ7ozSAkJWWbr8Ylkd4sQiTFoBBJMShEUgwKkRSDQiTFoBBJMShEUgwKSUlpKlbjkkjvDIVIikEhkmJQiKQYFCIpGVgObAT2AieAbuAmcB94BrwDPgNjBRaSkpLY85RZQB1wCLgAPACGi5BkScnAOqADuAeMGEh+pp7SQAkyG2h2PeCTgUQnVsoaoAv4aCCxiV08lgE7gYcGEpnonjIHOOBmP76Tl3gpu0pcRDCpp2zGKGtL8NMU5BBDrh7MDHPdtHXUQHICT1GPEeoS9HkKMoSJz9Zh4JeBZARJ/2SFxcxXDCQiMBDeB/Ulbn/JdyICA+F9gbgKGDCQiMBAeF8YVgGDBhIRGAgTPSPu+09BqfSMRcArA4kIDIT3nhHOph4bSERgIEycGl4ykIjAQHjvGSFtBhIRuBh1uwF33Vl6h1uU7gNa3Fl7LbASuFOKPaPWNSTqxP8FXriTxDaXiCp3zu6rDMi7jHnAy4gEfHX/9Z1u5lJhrFDOu4yQ00WWMAicB7a6s3WrpaQmZNQAv4sgYQS4CGyKSbG1CRkhfQUW0e/GgoUxuo5gRkZ9AUU8cYUNZTG7sON9apvOowKICKemrTG90taIIVpmKOIHcMxVmsTx0mcjhgg/K89nICPsWdXE91p0E8ZonsEirivPRZu1hwPMyQi5NQ0ZX4AtxPtpjUYMsgL4k6eMD269EufHZ5owyqk8ZbwGlmKbnjj2jNRgPpSHjLfAMuzTHkcZIevzkBFeFaskHsx3C9P09n+zLiPkbI4ywkK4DcSLcuAIcNn9nbF4BPNNjkLCgyBRZKpzlNHnaT8qcUw18KXHsDsSFRFwLQch4bVkERHZit4GjGwUJoLKHHrHHt+NTBK7s8h4r4E8WjqzCDkecXsSz/Usi8DFic9QxPRnEHI76saIieK0qYTsV4KipSLL+BGej4gIqclSUSgMbbnfiLoxYqKediohZ5Sg6NmRQchBD+1JPK0ZhGxPfHY8vez5v1c7x2JyXl6SnATG02SMu2dXhUca3F29bjfQCyGEEEIIIYQQQgghhMAY/wBFXQujAx9JfgAAAABJRU5ErkJggg==" />
                        </a>
                        <div onClick={() => navigator.clipboard.writeText(paymentLink)} className="flex items-center justify-center bg-black hover:bg-black/80 transition-all rounded-full w-6 h-6 aspect-square cursor-pointer">
                            <img className="h-3 invert" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nO2ZQUoDQRBFH7jVGzhrIXgLLxB04cYjKOixlIA7T+IJdKtiZqcRSjIKSpjETjuVrjT/Qe0GhpfpxxQZEEKIHxpgArSADTCPwJjAss8Dif6eGXBKQCYOsqGl24El36NL28Bz3CP9AZxRqTDRpc1BOLS0OQmHlTZH4ZDS5iy8UemmZ4MqITznxPuV1SzZoEoJr5Iee25Q3sL7rC/9gOMG5S18lyn9b6yQsEcKSUgYPeGO0kdZRzoXNYwa7ijdrhrORQ2jhjtKt6uGc1HDqOGO0u2q4VzUMGq4o3S7ajgXNczXj7Dn/EE8Z149n/Bo4brbAMLXnsKXC9cdAC8FZZ8S/rhPYtkN7oGdnu9QN8B0g6LT7yc7iCx/3OycCrEV8wYcURmWIH3Rc7y3FkucedNXwCGwyxZjQUbCXrS1bFCpVLNBpVLNBrUOVWxQQgghCM4n4VJdMOQj8EMAAAAASUVORK5CYII=" />
                        </div>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 p-1">{error}</p>}
        </div>
    );
}
