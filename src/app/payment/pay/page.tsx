// src/app/payment/check/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, BrowserProvider } from 'ethers';
import { useRouter } from 'next/navigation';
import React from "react";

export default function CheckPaymentLink() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [account, setAccount] = useState<string | null>(null);
    const [inputString, setInputString] = useState<string>('');
    const [secondLoading, setSecondLoading] = useState<boolean>(false);
    const [storedJson, setStoredJson] = useState<string | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [cryptoAmount, setCryptoAmount] = useState<string>('');
    const [payTo, setPayTo] = useState<string>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
    // const router = useRouter();

    const chainData = {
        "0x1": {
            name: "ETH",
            rpcUrl: "https://eth.llamarpc.com",
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18
            },
            imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        },
        "0x38": {
            name: "BSC",
            rpcUrl: "https://binance.llamarpc.com",
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18
            },
            imageUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
            contractAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        },
        "0x89": {
            name: "POLYGON",
            rpcUrl: "https://polygon.drpc.org",
            nativeCurrency: {
                name: "POL",
                symbol: "POL",
                decimals: 18
            },
            imageUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png",
            contractAddress: "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6",
        },
        "0xe708": {
            name: "LINEA",
            rpcUrl: "https://1rpc.io/linea",
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18
            },
            imageUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/27657.png",
            contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        }
    };

    const changeNetwork = async (currentNetwork: string) => {
        setSelectedNetwork(currentNetwork);

        try {
            const response = await fetch('/api/public/conversion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: String(amount),
                    token: chainData[String(currentNetwork)].nativeCurrency.symbol
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("API Response:", data);
                setCryptoAmount(String(data?.amount));
                console.log(amount)
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

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
            await handleClick();
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const handleClick = async () => {
        if (!account) {
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
        }

        initTxn(cryptoAmount);
    };

    const initTxn = async (amountInCrypto: string) => {
        try {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: String(selectedNetwork) }],
                });
            } catch (error) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: String(selectedNetwork),
                        chainName: String(chainData[String(selectedNetwork)].name),
                        rpcUrls: [String(chainData[String(selectedNetwork)].rpcUrl)],
                        nativeCurrency: chainData[String(selectedNetwork)].nativeCurrency
                    }],
                });

                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: String(selectedNetwork) }],
                });
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            if (String(selectedNetwork) === "0xAA36A7") {
                setWalletAddress(String(process.env.NEXT_PUBLIC_SEPOLIA_WALLET));
                console.log(String(process.env.NEXT_PUBLIC_SEPOLIA_WALLET));
            } else if (String(selectedNetwork) === "0x1") {
                setWalletAddress(String(process.env.NEXT_PUBLIC_ETHEREUM_WALLET));
                console.log(String(process.env.NEXT_PUBLIC_ETHEREUM_WALLET));
            } else {
                setWalletAddress(String(process.env.NEXT_PUBLIC_ETHEREUM_WALLET));
                console.log(String(process.env.NEXT_PUBLIC_ETHEREUM_WALLET));
            }

            const transactionRequest = {
                to: String(walletAddress),
                value: ethers.parseEther(parseFloat(amountInCrypto).toFixed(8).toString()),
                gasLimit: 21000,
            };

            setSecondLoading(true); // Set loading to true before sending transaction
            const tx = await signer.sendTransaction(transactionRequest);
            console.log("Transaction pending:", tx);
            await tx.wait(); // Wait for the transaction to be confirmed
            console.log("Transaction confirmed.");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setSecondLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        const checkPaymentLink = async () => {
            if (!id) {
                setStatus("Invalid link.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/public/payment/check?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    console.log(data.PaymentLink[0]);
                    setAmount(data.PaymentLink[0].amount);
                    setPayTo(data.PaymentLink[0].payTo);
                    setStatus(data.isExpired ? "This payment link has expired." : "This payment link is valid.");
                } else {
                    setStatus("Payment link not found.");
                }
            } catch (error) {
                setStatus("Error checking payment link.");
            }
            setLoading(false);
        };
        checkPaymentLink();
    }, [id]);

    return (
        <div>
            {loading ? <div className="flex w-full h-[100vh] items-center justify-center">
                <div className="flex h-96 w-60 bg-gray-200 rounded-lg animate-pulse"></div>
            </div> : <div className="flex w-full h-[100vh] items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto border border-gray-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-black"></div>
                            <span className="text-xl font-bold">CryptoWall</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <div className="w-4 h-4 bg-black mr-1"></div>
                                <span className="text-sm">+ 0.001</span>
                            </div>
                            {/* <Globe className="w-6 h-6" /> */}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <h2 className="text-4xl font-bold mr-2">{amount} USD</h2>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-lg font-bold">{cryptoAmount} {selectedNetwork ? chainData[String(selectedNetwork)].nativeCurrency.symbol : ""}</p>
                        {/* <p className="text-gray-600">{chainData[String(selectedNetwork)].nativeCurrency.symbol}</p> */}
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border-4 border-black/50 border-t-transparent animate-spin mr-2"></div>
                            <div>
                                <p className="text-gray-600 font-semibold">Waiting for payment</p>
                                <p className="text-gray-400">{status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        {/* <button className="w-full bg-gray-100 text-left px-4 py-3 rounded-lg flex justify-between items-center">
                                <span>TRON (TRC-20)</span>
                                <ChevronDown className="w-5 h-5" />
                            </button> */}
                        <select id="network-select" value={selectedNetwork} onChange={(e) => changeNetwork(e.target.value)} className="w-full bg-gray-100 text-left px-4 py-3 rounded-lg flex justify-between items-center">
                            <option value="">Select a token</option>
                            <option value="0xAA36A7">Sepolia</option>
                            <option value="0x1">ETH</option>
                            <option value="0x38">BSC</option>
                            <option value="0x89">POLYGON</option>
                            <option value="0xe708">LINEA</option>
                        </select>
                    </div>

                    {/* <button className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center mb-4">
                            <div className="w-5 h-5 bg-white mr-2"></div>
                            Pay with CryptoWall
                        </button> */}

                    <button onClick={connectWallet} disabled={secondLoading} className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center mb-4">
                        {loading ? "Confirming Transaction..." : "Pay with CrytpoWall"}
                    </button>

                    <div className="text-center mb-4">OR</div>

                    <button className="w-full bg-gray-300 text-black py-3 rounded-lg flex justify-center items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 3C14.5013 5.46452 15.9228 8.66283 16 12C15.9228 15.3372 14.5013 18.5355 12 21" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Wallet Connect
                    </button>
                </div>
            </div>
            }
        </div>
    );
}
