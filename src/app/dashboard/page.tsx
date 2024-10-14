"use client";

import { ArrowLeftRight, Bell, ChevronDown, Download, MessageCircle, MoveDownLeft, MoveUpRight, Wallet, Receipt, ChevronRight, MoreHorizontal, ChartNoAxesCombined, FileChartColumn, Link, Copy, QrCode, SquareArrowOutUpRight, ExternalLink, FileText, WalletMinimal, HandCoins, Crown } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import React from "react";
import { useQRCode } from 'next-qrcode';
import { list } from "postcss";
import DashboardNav from "../bin/components/DashboardNav";

export default function HeadDashboard() {
  const [amount, setAmount] = useState<string>("");
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState([]);
  const [businessLinkData, setBusinessLinkData] = useState([]);
  const [balanceData, setBalanceData] = useState<any[] | null>(null);
  const [conversionData, setConversionData] = useState([]);
  const [wallets, setWallets] = useState({});
  const [totalBalance, setTotalBalance] = useState<number | null>(0.00);
  const [personalBalance, setPersonalBalance] = useState<number | null>(0.00);
  const [businessBalance, setBusinessBalance] = useState<number | null>(0.00);
  const [loading, setLoading] = useState<boolean | true>(true);
  const { Image } = useQRCode();

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
        body: JSON.stringify({ amount: amount, paymentUrl: String(window.location.origin) }),
      });

      const data = await response.json();

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

  const getLinks = async () => {
    try {
      const response = await fetch("/api/private/getlinks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Personal/Business link data:", data);
      setLinkData(data.PersonalData);
      setBusinessLinkData(data.BusinessData);
    } catch (err) {
      setError("Failed to fetch payment links.");
    }
  }

  const getWallets = async () => {
    try {
      const response = await fetch("/api/private/wallets", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Wallets:", data);
      setWallets(data[0]);

      const walletData = {
        sepWallet: data[0].sepWallet === null ? null : data[0].sepWallet,
        ethWallet: data[0].ethWallet === null ? null : data[0].ethWallet,
        bnbWallet: data[0].bnbWallet === null ? null : data[0].bnbWallet,
        polWallet: data[0].polWallet === null ? null : data[0].polWallet,
        lineaWallet: data[0].lineaWallet === null ? null : data[0].lineaWallet
      }

      console.log("WalletData:", walletData);

      setWalletAddresses(walletData);
    } catch (err) {
      setError("Failed to fetch wallets.");
    }
  }

  const updateWallets = async () => {
    console.log("Updated wallets:", walletAddresses);
    try {
      const response = await fetch("/api/private/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddresses: walletAddresses })
      });

      const data = await response.json();
      window.location.reload();
    } catch (err) {
      setError("Failed to fetch wallets.");
    }
  }

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

      console.log("Wallets Value:", wallets);

      // setAssets(updatedAssets);
    } catch (err) {
      setError("Failed to fetch balances.");
    }
  }

  const getSeparateBal = async () => {
    try {
      const response = await fetch("/api/private/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      const ethUsdPersonal = data.personalBalances.ETH / conversionData["ETH"];
      const bnbUsdPersonal = data.personalBalances.BNB / conversionData["BNB"];
      const polUsdPersonal = data.personalBalances.POL / conversionData["POL"];

      const ethUsdBusiness = data.businessBalances.ETH / conversionData["ETH"];
      const bnbUsdBusiness = data.businessBalances.BNB / conversionData["BNB"];
      const polUsdBusiness = data.businessBalances.POL / conversionData["POL"];

      setPersonalBalance(Number((ethUsdPersonal + bnbUsdPersonal + polUsdPersonal).toFixed(2)));
      setBusinessBalance(Number((ethUsdBusiness + bnbUsdBusiness + polUsdBusiness).toFixed(2)));
    } catch (err) {
      setError("Failed to fetch separate balances.");
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

  const getTotalBalance = async () => {
    // Ensure that balanceData and conversionData have been fetched
    if (!balanceData || !conversionData || assets.length === 0) {
      console.log("Required data is missing, unable to calculate total balance.");
      return;
    }

    let totBal = 0;

    // Iterate over the assets and calculate total balance based on conversion data
    for (var i = 0; i < assets.length; i++) {
      const token = assets[i].token;
      const name = assets[i].name;
      const balance = parseFloat(assets[i].balance); // Convert string balance to a number

      // Ensure the conversion rate for the token exists
      const conversionRate = conversionData[String(token)];

      if (conversionRate) {
        totBal += Number((Number(parseFloat(balanceData[String(String(name).toLowerCase() + "Balance")])) / Number(parseFloat(conversionData[String(token)]))).toFixed(2));
      } else {
        console.log(`Conversion data not available for ${token}`);
      }
    }

    // Update total balance state
    setTotalBalance(totBal);
  };

  useEffect(() => {
    getLinks();
    getBalance();
    getConversion();
    getWallets();
  }, []);

  useEffect(() => {
    if (balanceData && conversionData && assets.length > 0) {
      getTotalBalance();
      getSeparateBal();
    }
  }, [balanceData, conversionData, assets]);

  useEffect(() => {
    if (balanceData && conversionData && assets.length > 0) {
      setLoading(false)
    }
  }, [balanceData, conversionData, assets]);

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav active={0}></DashboardNav>

      <main className="container mx-auto p-4 w-full md:w-3/4">
        <div className="bg-zinc-100 rounded-3xl p-6 mt-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Total funds</h2>
              <div className="flex flex-row gap-2 items-center justify-center text-4xl font-semibold">${loading ? <div className="flex bg-gray-200 rounded-lg h-8 w-20 animate-pulse"></div> : totalBalance} <span className="text-sm font-semibold self-end mb-1">USD</span></div>
            </div>
            <div className="flex space-x-4">
              <button>Refer & Earn</button>
              <button>Earn</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <AccountCard title="Personal" amount={personalBalance ? personalBalance : "0.00"} badge="" />
            <AccountCard title="Business" amount={businessBalance ? businessBalance : "0.00"} badge="+$0.00" />
            <AccountCard title="P2P Trade" amount="0.00" badge="" />
          </div>
        </div>
      </main>

      {/* // Modal for wallet addresses update */}
      <input className="modal-state" id="modal-1" type="checkbox" />
      <div className="modal">
        <label className="modal-overlay" htmlFor="modal-1"></label>
        <div className="modal-content flex flex-col gap-5 w-2/3">
          <label htmlFor="modal-1" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
          <h2 className="text-xl font-medium">Update Wallet Addresses</h2>
          <div className="flex flex-col gap-5 w-full">
            {assets.map((asset) => (
              <div className="flex flex-col w-full">
                <p className="font-medium">{asset.name} Wallet Address</p>
                <div className="flex items-center input input-solid input-block">
                  <img className="h-6 w-6" src={asset.icon} alt={asset.name} />
                  {(asset.name).toLowerCase() === 'sep' ? <input onChange={(e) => setWalletAddresses({ ...walletAddresses, sepWallet: String(e.target.value) })} className="input input-solid input-block" type="text" placeholder="Enter your wallet address" value={walletAddresses.sepWallet === null ? '' : walletAddresses.sepWallet} /> : null}
                  {(asset.name).toLowerCase() === 'eth' ? <input onChange={(e) => setWalletAddresses({ ...walletAddresses, ethWallet: String(e.target.value) })} className="input input-solid input-block" type="text" placeholder="Enter your wallet address" value={walletAddresses.ethWallet === null ? '' : walletAddresses.ethWallet} /> : null}
                  {(asset.name).toLowerCase() === 'bnb' ? <input onChange={(e) => setWalletAddresses({ ...walletAddresses, bnbWallet: String(e.target.value) })} className="input input-solid input-block" type="text" placeholder="Enter your wallet address" value={walletAddresses.bnbWallet === null ? '' : walletAddresses.bnbWallet} /> : null}
                  {(asset.name).toLowerCase() === 'pol' ? <input onChange={(e) => setWalletAddresses({ ...walletAddresses, polWallet: String(e.target.value) })} className="input input-solid input-block" type="text" placeholder="Enter your wallet address" value={walletAddresses.polWallet === null ? '' : walletAddresses.polWallet} /> : null}
                  {(asset.name).toLowerCase() === 'linea' ? <input onChange={(e) => setWalletAddresses({ ...walletAddresses, lineaWallet: String(e.target.value) })} className="input input-solid input-block" type="text" placeholder="Enter your wallet address" value={walletAddresses.lineaWallet === null ? '' : walletAddresses.lineaWallet} /> : null}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <label htmlFor="modal-1" className="btn btn-block hover:bg-zinc-200 transition-all">Cancel</label>
            <button onClick={updateWallets} className="btn btn-block bg-black hover:bg-zinc-700 transition-all text-white">Save</button>
          </div>
        </div>
      </div>


      <div className="container mx-auto p-4 w-full md:w-3/4 mt-10">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-medium">Assets</h1>
          <button className="flex flex-row items-center justify-center text-gray-500 hover:text-black transition-all">
            Show more <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="w-full mt-5">
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

          <div>
            <div className="text-center py-5 px-5 bg-gray-100 rounded-3xl mt-10">
              {/* {loading ? <div className="btn btn-loading"></div> : businessLinkData.map((link) => (
                <div className="flex items-center justify-between bg-gray-100 py-3 px-6 rounded-3xl">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-end gap-2">
                      <p className="text-2xl font-medium">${link.amount} USD</p>
                      {link.status === 'confirmed' ? <><p className="text-sm text-zinc-600 font-medium mb-1">{link.cryptoAmount}</p><p className="text-sm text-zinc-600 font-medium mb-1">({link.paidIn})</p></> : null}
                    </div>
                    <p className="text-zinc-400 text-xs">{link.id}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    {link.status === 'pending' ? <div className="dot dot-warning"></div> : <div className="dot dot-success"></div>}
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-sm capitalize">{link.status}</p>
                      <div className="dropdown">
                        <label tabIndex={0}>
                          <button className="bg-transparent hover:bg-gray-200 transition-all p-2 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </label>
                        <div className="dropdown-menu">
                          <a className="dropdown-item text-sm" href={link.paymentUrl} target="_blank">
                            <div className="flex flex-col">
                              <p className="flex flex-row gap-1 items-center font-medium"><ExternalLink size={16} />Visit</p>
                              <p className="text-zinc-500 text-xs m-1">Visit your payment link</p>
                            </div>
                          </a>
                          <a tabIndex={-1} className="dropdown-item text-sm">
                            <div className="flex flex-col" onClick={() => navigator.clipboard.writeText(link.paymentUrl)}>
                              <p className="flex flex-row gap-1 items-center font-medium"><Copy size={16} />Copy URL</p>
                              <p className="text-zinc-500 text-xs m-1">Copy your payment link to clipboard</p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))} */}


              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Txn Hash</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {businessLinkData.map((link) => (
                    <tr key={link.name} className="border-t">
                      <td className="py-4 w-1/3">
                        <div className="flex items-center gap-3 w-max">
                          {((link.paidIn).split("|")[0]).toLowerCase() === 'sep' ?
                            <img className="h-5 w-5 aspect-square" src={assets[0].icon} alt="Token Icon" /> :
                            null
                          }
                          {((link.paidIn).split("|")[0]).toLowerCase() === 'eth' ?
                            <img className="h-5 w-5 aspect-square" src={assets[1].icon} alt="Token Icon" /> :
                            null
                          }
                          {((link.paidIn).split("|")[0]).toLowerCase() === 'bnb' ?
                            <img className="h-5 w-5 aspect-square" src={assets[2].icon} alt="Token Icon" /> :
                            null
                          }
                          {((link.paidIn).split("|")[0]).toLowerCase() === 'pol' ?
                            <img className="h-5 w-5 aspect-square" src={assets[3].icon} alt="Token Icon" /> :
                            null
                          }
                          {((link.paidIn).split("|")[0]).toLowerCase() === 'linea' ?
                            <img className="h-5 w-5 aspect-square" src={assets[4].icon} alt="Token Icon" /> :
                            null
                          }
                          <div className="flex flex-col items-start">
                            <p className="font-medium">{link.paidIn}</p>
                            <p className="text-zinc-500 text-xs">{link.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col items-start">
                          <p className="text-black">{link.cryptoAmount}</p>
                          <p className="text-zinc-500">${link.amount}</p>
                        </div>
                      </td>
                      <td className="py-4"><p className="text-start">{conversionData[String((link.paidIn).split("|")[0])]}</p></td>
                      <td>
                        <div className="flex flex-col">
                          <p className="text-start">{(link.expiresAt).split("T")[0]}</p>
                          <p className="text-start">{((link.expiresAt).split("T")[1].split("."))[0]}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-start">0x_testHash</p>
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
              {!loading && businessLinkData.length < 1 ? <><h2 className="text-xl font-medium mb-2">No transactions yet</h2>
                <p className="text-gray-500 mb-4">You don't have any transactions</p><a className="btn bg-black hover:bg-zinc-800 text-white transition-all gap-2 font-normal rounded-2xl" href="/documentation"><SquareArrowOutUpRight size={14} />Read Docs</a></> : null}
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col w-full md:w-3/4 mx-auto mt-20 p-5 md:p-0">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-medium">Your Instant Payment Link</h1>
          <button className="hidden md:flex flex-row items-center justify-center text-gray-500 hover:text-black transition-all">
            Show more <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="rounded-lg w-full md:w-2/5 h-max">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center rounded gap-0 h-[100%] w-2/3 px-2">
                <p className="flex items-center justify-center font-medium text-6xl">$</p>
                <input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent font-medium placeholder:text-zinc-500 text-6xl p-2 w-full border-transparent outline-none focus:border-transparent focus:ring-0"
                />
              </div>
              <button className="btn bg-black text-white py-2 px-8 rounded-2xl text-xs hover:bg-zinc-800 transition-all" onClick={(e) => createPaymentLink(e.target)}>Create Link</button>
              {paymentLink && (
                <div className="">
                  <div className="flex flex-row items-center h-max overflow-y-hidden">
                    <Link size={14} />
                    <a className="w-[75%] bg-white after:content-['...'] overflow-y-hidden truncate py-1 px-2 rounded text-black underline text-sm" href={paymentLink} target="_blank">{paymentLink}</a>
                  </div>
                  <div className="flex flex-row gap-5 mt-3 w-full items-center justify-start">
                    <span className="tooltip tooltip-bottom" data-tooltip="Visit Link">
                      <a href={paymentLink} className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-all rounded-full w-10 h-10 aspect-square cursor-pointer">
                        <SquareArrowOutUpRight />
                      </a>
                    </span>
                    <div className="dropdown">
                      <label tabIndex={0}>
                        <span className="tooltip tooltip-bottom" data-tooltip="QR Code">
                          <button className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-all rounded-full w-10 h-10 aspect-square cursor-pointer">
                            <QrCode />
                          </button>
                        </span>
                      </label>
                      <div className="dropdown-menu dropdown-menu-bottom-right mt-2">
                        <Image
                          text={paymentLink}
                          options={{
                            type: 'image/jpeg',
                            quality: 1,
                            errorCorrectionLevel: 'M',
                            margin: 1,
                            scale: 4,
                            width: 200,
                            color: {
                              dark: '#000000',
                              light: '#FFFFFF',
                            },
                          }}
                        />
                      </div>
                    </div>
                    <span className="tooltip tooltip-bottom" data-tooltip="Copy Link">
                      <button onClick={() => navigator.clipboard.writeText(paymentLink)} className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-all rounded-full w-10 h-10 aspect-square cursor-pointer">
                        <Copy />
                      </button>
                    </span>
                  </div>
                </div>
              )}
              {error && <p className="text-error p-1">{error}</p>}
            </div>
          </div>

          <div className="flex flex-col h-72 gap-3 max-h-96 w-full md:w-3/5 mt-5 rounded-3xl overflow-y-scroll">
            {loading ? <div className="btn btn-loading mt-16"></div> : linkData.map((link) => (
              <div className="flex items-center justify-between bg-gray-100 py-3 px-6 rounded-3xl">
                <div className="flex flex-col">
                  <div className="flex flex-row items-end gap-2">
                    <p className="text-2xl font-medium">${link.amount}</p>
                    {link.status === 'confirmed' ? <><p className="text-sm text-zinc-600 font-medium mb-1">{link.cryptoAmount}</p><p className="text-sm text-zinc-600 font-medium mb-1">({link.paidIn})</p></> : null}
                  </div>
                  <p className="text-zinc-400 text-xs">{link.id}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  {link.status === 'pending' ? <div className="dot dot-warning"></div> : <div className="dot dot-success"></div>}
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-sm capitalize">{link.status}</p>
                    <div className="dropdown">
                      <label tabIndex={0}>
                        <button className="bg-transparent hover:bg-gray-200 transition-all p-2 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </label>
                      <div className="dropdown-menu">
                        <a className="dropdown-item text-sm" href={link.paymentUrl} target="_blank">
                          <div className="flex flex-col">
                            <p className="flex flex-row gap-1 items-center font-medium"><ExternalLink size={16} />Visit</p>
                            <p className="text-zinc-500 text-xs m-1">Visit your payment link</p>
                          </div>
                        </a>
                        <a tabIndex={-1} className="dropdown-item text-sm">
                          <div className="flex flex-col" onClick={() => navigator.clipboard.writeText(link.paymentUrl)}>
                            <p className="flex flex-row gap-1 items-center font-medium"><Copy size={16} />Copy URL</p>
                            <p className="text-zinc-500 text-xs m-1">Copy your payment link to clipboard</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!loading && linkData.length < 1 ? <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl p-10"><p className="font-medium">You have not created any payment links</p><p className="text-gray-600 text-sm">Create your first payment link to see it here.</p></div> : null}
          </div>
        </div>
      </div>
    </div >
  )
}

function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-white rounded-md" />
      <span className="text-xl font-semibold">CryptoWall</span>
    </div>
  )
}

function AccountCard({ title, amount, badge }) {
  return (
    <div className="bg-white p-4 rounded-2xl hover:shadow-lg transition-all">
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex flex-row gap-2 items-center">{title}{title === 'P2P Trade' ? <Crown size={14} className="text-yellow-500" fill="rgb(234, 179, 8)" /> : null}</h3>
        {title != 'P2P Trade' ? <div className="dropdown">
          <label tabIndex={0}>
            <button className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-all rounded-full h-8 w-8 aspect-square">
              <ChevronDown className="h-4 w-4" />
            </button>
          </label>
          <div className="dropdown-menu w-72">
            <a className="dropdown-item text-sm pointer-events-none" href={title === "Personal" ? "/analytics/personal" : title === "Business" ? "/analytics/business" : null}>
              <div className="flex flex-col">
                <p className="flex flex-row gap-1 items-center font-medium text-zinc-600"><ChartNoAxesCombined size={16} />Analytics<Crown size={12} className="text-yellow-500" fill="rgb(234, 179, 8)" /></p>
                <p className="text-zinc-500 text-xs m-1">See how well you've performed in terms of numbers.</p>
              </div>
            </a>
            <a tabIndex={-1} className="dropdown-item text-sm pointer-events-none" href={title === "Personal" ? "/reports/personal" : title === "Business" ? "/reports/business" : null}>
              <div className="flex flex-col">
                <p className="flex flex-row gap-1 items-center font-medium text-zinc-600"><FileChartColumn size={16} />Report<Crown size={12} className="text-yellow-500" fill="rgb(234, 179, 8)" /></p>
                <p className="text-zinc-500 text-xs m-1">Get a report of all your transactions.</p>
              </div>
            </a>
            {title === 'Business' ?
              <a tabIndex={-1} className="dropdown-item text-sm" href={title === "Business" ? "/documentation" : null}>
                <div className="flex flex-col">
                  <p className="flex flex-row gap-1 items-center font-medium"><FileText size={16} />Documentation</p>
                  <p className="text-zinc-500 text-xs m-1">Learn how to integrate CryptoWall in your website.</p>
                </div>
              </a> : null
            }
          </div>
        </div> : null}
      </div>
      <div className="text-3xl font-semibold flex flex-row items-end">
        <div className="flex flex-row items-center gap-1">
          ${amount}
        </div>
        {badge && <span className="ml-2 text-sm font-normal text-green-500 bg-green-100 px-2 py-1 rounded-full">{badge}</span>}
      </div>
      <div className="flex space-x-2 mt-4">
        {title === "Personal" && (
          <>
            <button className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:opacity-50 transition-all rounded-full h-10 w-10 aspect-square"><MoveUpRight /></button>
            <button className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:opacity-50 transition-all rounded-full h-10 w-10 aspect-square"><MoveDownLeft /></button>
            <button disabled className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:opacity-50 transition-all rounded-full h-10 w-10 aspect-square"><ArrowLeftRight /></button>
          </>
        )}
        {title === "Business" && (
          <>
            <button className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:opacity-50 transition-all rounded-full h-10 w-10 aspect-square"><MoveDownLeft /></button>
            <button className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:opacity-50 transition-all rounded-full h-10 w-10 aspect-square"><Receipt /></button>
          </>
        )}
        {title === "P2P Trade" && (
          <>
            <button disabled className="flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:opacity-50 transition-all rounded-full h-10 w-10 aspect-square"><ArrowLeftRight /></button>
          </>
        )}
      </div>
    </div>
  )
}