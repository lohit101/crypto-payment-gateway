"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { ChevronDown, Wallet, Bell, MessageCircle, Download, HandCoins, MoreHorizontal, WalletMinimal } from "lucide-react";
import DashboardNav from "../bin/components/DashboardNav";
import { useEffect, useState } from "react";

export default function Withdraw() {
    const [loading, setLoading] = useState<boolean | true>(true);
    const [balanceData, setBalanceData] = useState<any[] | null>(null);
    const [conversionData, setConversionData] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState<string>('');

    const [walletAddresses, setWalletAddresses] = useState({
        sepWallet: null,
        ethWallet: null,
        bnbWallet: null,
        polWallet: null,
        lineaWallet: null
    });

    const [assets, setAssets] = useState([
        { name: 'SEP', token: "ETH", walletAddress: "", balance: '0.000000', balanceUsd: '0.00', price: '30.13', allocation: '0', icon: 'https://uniswap-dex-with-moralis.vercel.app/img/eth.png' },
        { name: 'ETH', token: "ETH", walletAddress: "", balance: '0.00000000', balanceUsd: '0.00', price: '359.52', allocation: '0', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { name: 'BNB', token: "BNB", walletAddress: "", balance: '0.000000', balanceUsd: '0.00', price: '606.04', allocation: '0', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
        { name: 'POL', token: "POL", walletAddress: "", balance: '0.00000000', balanceUsd: '0.00', price: '65737.39', allocation: '0', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
        { name: 'LINEA', token: "ETH", walletAddress: "", balance: '0.00', balanceUsd: '0.00', price: '1.00', allocation: '0', icon: 'https://s2.coinmarketcap.com/static/img/coins/200x200/27657.png' },
    ]);

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

    const getBalance = async () => {
        try {
            const response = await fetch("/api/private/balance", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setBalanceData(data[0]);

            const updatedAssets = assets.map((asset) => {
                if (asset.name === 'SEP') {
                    return { ...asset, balance: data[0]['sepBalance'] };
                } else if (asset.name === 'ETH') {
                    return { ...asset, balance: data[0]['ethBalance'] };
                } else if (asset.name === 'BNB') {
                    return { ...asset, balance: data[0]['bnbBalance'] };
                } else if (asset.name === 'POL') {
                    return { ...asset, balance: data[0]['polBalance'] };
                } else if (asset.name === 'LINEA') {
                    return { ...asset, balance: data[0]['lineaBalance'] };
                }
                return asset; // Default case, return the original asset if no match
            });

            //   console.log("Wallets Value:", wallets);

            // setAssets(updatedAssets);
        } catch (err) {
            console.log("Failed to fetch balances.");
        }
    }

    const getWallets = async () => {
        try {
            const response = await fetch("/api/public/wallets", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log(data[0]);
            setWalletAddresses(data[0]);
        } catch (err) {
            console.log("Failed to fetch wallets.");
        }
    }

    const getConversion = async () => {
        try {
            const response = await fetch('/api/public/conversion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: "ETH,BNB,POL",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setConversionData(data);
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    const changeNetwork = async (currentNetwork: string) => {
        setSelectedNetwork(currentNetwork);
        console.log(currentNetwork);
    }

    useEffect(() => {
        getBalance();
        getWallets();
        getConversion();
    }, []);

    useEffect(() => {
        if (balanceData && conversionData && assets.length > 0) {
            setLoading(false)
        }
    }, [balanceData, conversionData, assets]);

    return (
        <>
            <DashboardNav active={4}></DashboardNav>

            <div className="flex w-3/4 mx-auto gap-10 mt-20">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-500">
                            <th className="pb-2 font-medium">Name</th>
                            <th className="pb-2 font-medium">Balance</th>
                            <th className="pb-2 font-medium">Price</th>
                            <th className="pb-2 font-medium">Enabled</th>
                            <th className="pb-2 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.name} className="border-t">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <img className="h-5 w-5 aspect-square" src={asset.icon} alt="Token Icon" />
                                        <span className="font-medium">{asset.name}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    {balanceData ? <><div>{balanceData[String(String(asset.name).toLowerCase() + "Balance")]}</div><div className="text-sm text-gray-500">${(Number(parseFloat(balanceData[String(String(asset.name).toLowerCase() + "Balance")])) / Number(parseFloat(conversionData[String(asset.token)]))).toFixed(2)}</div></> : <><div className="flex bg-gray-200 rounded-lg h-3 w-20 animate-pulse"></div><div className="flex bg-gray-200 rounded-lg h-3 w-10 animate-pulse mt-1"></div></>}
                                </td>
                                <td className="py-4 hidden sm:flex">{loading ? <div className="flex bg-gray-200 rounded-lg h-3 w-20 animate-pulse"></div> : conversionData[String(asset.token)]}</td>
                                <td className="py-4">
                                    <p>{(asset.name).toLowerCase() === 'sep' ? walletAddresses.sepWallet === null ? <label className="btn btn-ghost p-0 m-0 bg-transparent hover:bg-transparent" htmlFor="modal-1">+ Add wallet</label> : <input type="checkbox" checked disabled className="switch switch-black checked:bg-black checked:border-black" /> : null}</p>
                                    <p>{(asset.name).toLowerCase() === 'eth' ? walletAddresses.ethWallet === null ? <label className="btn btn-ghost p-0 m-0 bg-transparent hover:bg-transparent" htmlFor="modal-1">+ Add wallet</label> : <input type="checkbox" checked disabled className="switch switch-black checked:bg-black checked:border-black" /> : null}</p>
                                    <p>{(asset.name).toLowerCase() === 'bnb' ? walletAddresses.bnbWallet === null ? <label className="btn btn-ghost p-0 m-0 bg-transparent hover:bg-transparent" htmlFor="modal-1">+ Add wallet</label> : <input type="checkbox" checked disabled className="switch switch-black checked:bg-black checked:border-black" /> : null}</p>
                                    <p>{(asset.name).toLowerCase() === 'pol' ? walletAddresses.polWallet === null ? <label className="btn btn-ghost p-0 m-0 bg-transparent hover:bg-transparent" htmlFor="modal-1">+ Add wallet</label> : <input type="checkbox" checked disabled className="switch switch-black checked:bg-black checked:border-black" /> : null}</p>
                                    <p>{(asset.name).toLowerCase() === 'linea' ? walletAddresses.lineaWallet === null ? <label className="btn btn-ghost p-0 m-0 bg-transparent hover:bg-transparent" htmlFor="modal-1">+ Add wallet</label> : <input type="checkbox" checked disabled className="switch switch-black checked:bg-black checked:border-black" /> : null}</p>
                                </td>
                                <td className="items-center py-4">
                                    <div className="dropdown">
                                        <label tabIndex={0}>
                                            <button className="bg-transparent hover:bg-gray-200 transition-all p-2 rounded-full">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </label>
                                        <div className="dropdown-menu w-72">
                                            <label htmlFor="modal-1" className="dropdown-item text-sm">
                                                <div className="flex flex-col">
                                                    <p className="flex flex-row gap-1 items-center font-medium"><WalletMinimal size={16} />Edit Wallet Address</p>
                                                    <p className="text-zinc-500 text-xs m-1">Change wallet address to recieve your money in.</p>
                                                </div>
                                            </label>
                                            <a tabIndex={-1} className="dropdown-item text-sm" href="/withdraw">
                                                <div className="flex flex-col">
                                                    <p className="flex flex-row gap-1 items-center font-medium"><HandCoins size={16} />Withdraw</p>
                                                    <p className="text-zinc-500 text-xs m-1">Withdraw your balance to your wallet.</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex h-96 w-1/3 bg-red-400">
                    <div className="flex flex-col w-full">
                        <p className="text-2xl font-medium">Select Token</p>
                        <div className="dropdown-container justify-center">
                            <div className="dropdown w-full">
                                <label tabIndex={0} className="btn btn-solid w-full bg-zinc-100 items-center justify-between">
                                    <div className="font-normal">{selectedNetwork ? <div className="text-sm flex flex-row items-center justify-start gap-2">
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
                </div>
            </div>
        </>
    )
}