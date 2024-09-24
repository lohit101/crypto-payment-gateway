"use client";

import { useState } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, BrowserProvider } from 'ethers';
import { useRouter } from 'next/navigation';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/app/abi/remix_abi';

export default function Home() {
    const [account, setAccount] = useState<string | null>(null);
    const [inputString, setInputString] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [storedJson, setStoredJson] = useState<string | null>(null);
    const router = useRouter();

    const connectWallet = async () => {
        try {
            const web3Modal = new Web3Modal({
                cacheProvider: false,
                providerOptions: {
                    walletconnect: {
                        package: WalletConnectProvider,
                        options: {
                            infuraId: "bc52f2e268fb4f479e6bbdc5c4c8d382"
                        }
                    }
                }
            });

            const instance = await web3Modal.connect();
            const provider = new ethers.BrowserProvider(instance);
            const signer = await provider.getSigner();
            const userAccount = await signer.getAddress();
            setAccount(userAccount);

            console.log('Connected account:', userAccount);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const storeJsonInContract = async (jsonData: string) => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const tx = await contract.storeJson(jsonData);
            console.log("Transaction pending...");
            await tx.wait();

            console.log("Transaction confirmed, JSON stored in contract.");
        } catch (error) {
            console.error("Error storing JSON in contract:", error);
        }
    };

    const retrieveJsonFromContract = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const json = await contract.getJson();
            setStoredJson(json); // Store the retrieved JSON in state

            console.log("Retrieved JSON from contract:", json);
        } catch (error) {
            console.error("Error retrieving JSON from contract:", error);
        }
    };

    const handleClick = async () => {
        try {
            const response = await fetch('/api/public/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAccount: String(inputString)
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("API Response:", data);
                // Store the JSON response in the smart contract
                await storeJsonInContract(JSON.stringify(data));

                // Retrieve the stored JSON after the transaction
                await retrieveJsonFromContract();
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div>
            <h1 className='text-3xl font-bold my-2'>Connect to Sepolia Testnet</h1>
            {!account ? (
                <button onClick={connectWallet} className='bg-blue-500 py-2 px-4 rounded-lg text-white'>Connect Wallet</button>
            ) : (
                <div>
                    <p className='my-2'>Connected account: {account}</p>
                    <input
                        type="text"
                        placeholder="Enter String"
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value)}
                    />
                    <button onClick={handleClick} disabled={loading} className='bg-blue-500 py-2 px-4 rounded-lg text-white'>
                        {loading ? "Setting String..." : "Set String"}
                    </button>
                    {storedJson && (
                        <div className='my-2'>
                            <h2>Stored JSON:</h2>
                            <pre>{storedJson}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}