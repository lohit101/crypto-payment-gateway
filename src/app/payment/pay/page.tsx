// src/app/payment/check/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, BrowserProvider, Wallet } from 'ethers';
import { useRouter } from 'next/navigation';
import React from "react";
import { ChevronDown } from "lucide-react";

export default function CheckPaymentLink() {
    const [expired, setExpired] = useState<boolean>(true);
    const [payment, setPayment] = useState<boolean>(false);
    const [btnLoading, setBtnLoading] = useState<boolean>(true);
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
    const [walletAddresses, setWalletAddresses] = useState({
        sepWallet: null,
        ethWallet: null,
        bnbWallet: null,
        polWallet: null,
        lineaWallet: null
    });
    // const router = useRouter();

    const chainData = {
        "0xAA36A7": {
            name: "SEP",
            rpcUrl: "",
            nativeCurrency: {
                name: "SEPOLIA",
                symbol: "ETH",
                decimals: 18
            },
            imageUrl: "https://uniswap-dex-with-moralis.vercel.app/img/eth.png",
            contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        },
        "0x1": {
            name: "ETH",
            rpcUrl: "https://eth.llamarpc.com",
            nativeCurrency: {
                name: "ERC-20",
                symbol: "ETH",
                decimals: 18
            },
            imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        },
        "0x38": {
            name: "BNB",
            rpcUrl: "https://binance.llamarpc.com",
            nativeCurrency: {
                name: "BSC",
                symbol: "BNB",
                decimals: 18
            },
            imageUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
            contractAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        },
        "0x89": {
            name: "POL",
            rpcUrl: "https://polygon.drpc.org",
            nativeCurrency: {
                name: "POLYGON",
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
                name: "LINEA",
                symbol: "ETH",
                decimals: 18
            },
            imageUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/27657.png",
            contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        },
        "0x384": {
            name: "SOLANA",
            rpcUrl: "https://api.mainnet-beta.solana.com",
            nativeCurrency: {
                name: "SOLANA",
                symbol: "SOL",
                decimals: 18
            },
            imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
            contractAddress: "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF",
        }
    };

    const fetchCryptoAmount = async (network: string) => {
        if (network && amount) {
            try {
                const response = await fetch('/api/public/conversion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // amount: String(amount),
                        token: chainData[network].nativeCurrency.symbol,
                    }),
                });

                const data = await response.json();

                const ca = Number(parseFloat(data[String(chainData[network].nativeCurrency.symbol)]).toFixed(18));
                const usda = Number(parseFloat(amount).toFixed(18));

                if (response.ok) {
                    console.log("API Response:", data);
                    setCryptoAmount(String(ca * usda));
                } else {
                    console.error("API Error:", data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }
        setBtnLoading(false);
        setLoading(false);
    };

    const changeNetwork = async (currentNetwork: string) => {
        setBtnLoading(true);
        setLoading(true);
        setSelectedNetwork(currentNetwork);
        await fetchCryptoAmount(currentNetwork);

        console.log(currentNetwork);
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
            console.log('Connected account:', userAccount);

            setAccount(userAccount);
            handleClick();
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
            let accounts = await provider.send("eth_requestAccounts", []);
            let account = accounts[0];

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
            const finalCryptoAmount = parseFloat(amountInCrypto).toFixed(18);

            setBtnLoading(true);
            setSecondLoading(true); // Set loading to true before sending transaction
            const tx = await signer.sendTransaction(transactionRequest);
            console.log("Transaction pending:", tx);

            // await tx.wait(); // Wait for the transaction to be confirmed
            await tx.isMined();
            setPayment(true);

            try {
                const response = await fetch('/api/public/payment/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentId: String(searchParams.get('id')),
                        paidBy: String(account),
                        paidIn: String(chainData[selectedNetwork].nativeCurrency.symbol + "|" + chainData[selectedNetwork].name),
                        cryptoAmount: finalCryptoAmount,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Update API Response:", data);
                } else {
                    console.error("API Error:", data);
                }
            } catch (error) {
                // setExpired(true);
            }

            console.log("Transaction confirmed.");
        } catch (error) {
            setBtnLoading(true);
            console.error("Error:", error);
        } finally {
            setSecondLoading(false); // Reset loading state
        }
    };

    const testFunc = async () => {
        const finalCryptoAmount = parseFloat(cryptoAmount).toFixed(18);
        console.log(finalCryptoAmount);

        try {
            const response = await fetch('/api/public/payment/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentId: String(searchParams.get('id')),
                    paidBy: "0x_testAddress",
                    paidIn: String(chainData[selectedNetwork].nativeCurrency.symbol + "|" + chainData[selectedNetwork].name),
                    cryptoAmount: finalCryptoAmount,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Update API Response:", data);
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            // setExpired(true);
        }
    }

    useEffect(() => {
        const checkPaymentLink = async () => {
            if (!id) {
                setExpired(true);
                setBtnLoading(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/public/payment/check?id=${id}`);
                const data = await response.json();

                if (response.ok) {
                    if (String(data.PaymentLink[0].status) === 'confirmed') {
                        console.log("working");
                        await setPayment(true);
                    }
                    console.log(data.PaymentLink[0]);
                    setAmount(data.PaymentLink[0].amount);
                    setPayTo(data.PaymentLink[0].payTo);
                    setExpired(data.isExpired ? true : false);
                } else {
                    setExpired(true);
                }
            } catch (error) {
                setExpired(true);
            }
            setBtnLoading(false);
        };
        checkPaymentLink();
    }, [id]);

    useEffect(() => {
        fetchCryptoAmount(selectedNetwork);
        const interval = setInterval(() => {
            if (selectedNetwork) {
                fetchCryptoAmount(selectedNetwork);
            }
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [selectedNetwork, amount]);

    const getWallets = async () => {
        try {
            const response = await fetch("/api/public/wallets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: String(payTo) })
            });

            const data = await response.json();
            console.log(data[0]);
            setWalletAddresses(data[0]);
        } catch (err) {
            console.log("Failed to fetch wallets.");
        }
    }

    useEffect(() => {
        getWallets();
    }, [payTo])

    return (
        <div>
            <div className="flex w-full h-[100vh] items-center justify-center bg-zinc-100">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto border border-gray-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-black"></div>
                            <span className="text-xl font-semibold">CryptoWall</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <div className="w-4 h-4 bg-black mr-1"></div>
                                <span className="text-sm">+ 0.001</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex w-full items-center mb-1">
                            <h2 className="flex flex-row gap-2 text-4xl font-medium mr-2 w-max">{loading ? <div className="flex h-10 w-20 bg-gray-300 rounded animate-pulse"></div> : amount} USD</h2>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex flex-row items-center gap-2 text-lg font-medium text-zinc-500">{loading ? <div className="flex h-5 w-10 bg-gray-300 rounded animate-pulse"></div> : cryptoAmount} {selectedNetwork ? chainData[String(selectedNetwork)].nativeCurrency.symbol : ""}</div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            {payment ? null : <div className="w-6 h-6 rounded-full border-4 border-black/50 border-t-transparent animate-spin mr-2"></div>}
                            <div>
                                <p className="text-gray-600 font-semibold">{payment ? "Payment Completed" : "Waiting for payment"}</p>
                                <p className="text-gray-400">{payment ? "This payment has been completed." : "Complete the payment to proceed."}</p>
                            </div>
                        </div>
                    </div>

                    {payment ?
                        null :
                        <>
                            <div className="mb-4">
                                <div className="dropdown-container justify-center">
                                    <div className="dropdown w-full">
                                        <label tabIndex={0} className="btn btn-solid w-full bg-zinc-100 items-center justify-between">
                                            <div className="font-normal">{selectedNetwork ? <div data-value="0xAA36A7" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center justify-start gap-2">
                                                <img src={chainData[selectedNetwork].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <p className="text-black font-medium">{chainData[selectedNetwork].nativeCurrency.symbol}</p>
                                            </div> : "Select a Token"}</div>
                                            <ChevronDown size={14} />
                                        </label>
                                        <div className="dropdown-menu dropdown-menu-bottom-center w-[90dvw] min-w-[90dvw] max-w-[90dvw] md:w-[20dvw] md:min-w-[20dvw] md:max-w-[20dvw] max-h-60 overflow-y-scroll mt-2 md:ml-20">
                                            {walletAddresses.sepWallet ? <div data-value="0xAA36A7" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center gap-2">
                                                <img src={chainData["0xAA36A7"].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <div className="flex flex-col">
                                                    <p className="text-black font-medium">{chainData["0xAA36A7"].nativeCurrency.symbol}</p>
                                                    <p className="text-zinc-600 text-xs">{chainData["0xAA36A7"].nativeCurrency.name}</p>
                                                </div>
                                            </div> : null}
                                            {walletAddresses.ethWallet ? <div data-value="0x1" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center gap-2">
                                                <img src={chainData["0x1"].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <div className="flex flex-col">
                                                    <p className="text-black font-medium">{chainData["0x1"].nativeCurrency.symbol}</p>
                                                    <p className="text-zinc-600 text-xs">{chainData["0x1"].nativeCurrency.name}</p>
                                                </div>
                                            </div> : null}
                                            {walletAddresses.bnbWallet ? <div data-value="0x38" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center gap-2">
                                                <img src={chainData["0x38"].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <div className="flex flex-col">
                                                    <p className="text-black font-medium">{chainData["0x38"].nativeCurrency.symbol}</p>
                                                    <p className="text-zinc-600 text-xs">{chainData["0x38"].nativeCurrency.name}</p>
                                                </div>
                                            </div> : null}
                                            {walletAddresses.polWallet ? <div data-value="0x89" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center gap-2">
                                                <img src={chainData["0x89"].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <div className="flex flex-col">
                                                    <p className="text-black font-medium">{chainData["0x89"].nativeCurrency.symbol}</p>
                                                    <p className="text-zinc-600 text-xs">{chainData["0x89"].nativeCurrency.name}</p>
                                                </div>
                                            </div> : null}
                                            {walletAddresses.lineaWallet ? <div data-value="0xe708" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center gap-2">
                                                <img src={chainData["0xe708"].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <div className="flex flex-col">
                                                    <p className="text-black font-medium">{chainData["0xe708"].nativeCurrency.symbol}</p>
                                                    <p className="text-zinc-600 text-xs">{chainData["0xe708"].nativeCurrency.name}</p>
                                                </div>
                                            </div> : null}
                                            {walletAddresses.sepWallet ? <div data-value="0x384" onClick={(e) => { changeNetwork(e.currentTarget.dataset.value) }} className="dropdown-item text-sm flex flex-row items-center gap-2">
                                                <img src={chainData["0x384"].imageUrl} alt="Token Image" className="w-5 h-5" />
                                                <div className="flex flex-col">
                                                    <p className="text-black font-medium">{chainData["0x384"].nativeCurrency.symbol}</p>
                                                    <p className="text-zinc-600 text-xs">{chainData["0x384"].nativeCurrency.name}</p>
                                                </div>
                                            </div> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <button onClick={connectWallet} disabled={btnLoading ? true : false} className="btn btn-solid bg-black hover:bg-zinc-800 w-full transition-all text-white font-normal py-3 flex justify-center items-center mb-4"> */}
                            <button onClick={testFunc} disabled={btnLoading ? true : false} className="btn btn-solid bg-black hover:bg-zinc-800 w-full transition-all text-white font-normal py-3 flex justify-center items-center mb-4">
                                {loading ? "Loading..." : "Pay with CrytpoWall"}
                            </button>

                            <div className="text-center mb-4">OR</div>

                            <button className="w-full bg-gray-300 hover:bg-gray-400 transition-all text-black py-3 rounded-lg flex justify-center items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 3C14.5013 5.46452 15.9228 8.66283 16 12C15.9228 15.3372 14.5013 18.5355 12 21" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                Wallet Connect
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
