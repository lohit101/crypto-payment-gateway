import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { ChevronDown, Wallet, Bell, MessageCircle, Download } from "lucide-react";

export default function DashboardNav({active}) {
    return (
        <>
            <header className="bg-black text-white p-8">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4 gap-5">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-md" />
                            <span className="text-xl font-normal">CryptoWall</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex gap-4">
                            <button>
                                <Wallet className="h-5 w-5" />
                            </button>
                            <button>
                                <Bell className="h-5 w-5" />
                            </button>
                            <button>
                                <MessageCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </header>


            <nav className="hidden sm:flex bg-white border-b shadow-[0_35px_30px_-15px_rgba(0,0,0,0.05)] sticky top-0 z-50">
                <div className="container mx-auto flex space-x-8 py-5 w-full md:w-3/4">
                    <a href="/dashboard" className={active === 0 ? "text-black font-medium border-b border-b-black" : "text-gray-500 border-b border-transparent hover:text-gray-800 hover:border-b-black transition-all"}>Overview</a>
                    <a href="#" className={active === 1 ? "text-black font-medium border-b border-b-black" : "text-gray-500 border-b border-transparent hover:text-gray-800 hover:border-b-black transition-all"}>Personal</a>
                    <a href="#" className={active === 2 ? "text-black font-medium border-b border-b-black" : "text-gray-500 border-b border-transparent hover:text-gray-800 hover:border-b-black transition-all"}>Business</a>
                    <a href="#" className={active === 3 ? "text-black font-medium border-b border-b-black" : "text-gray-500 border-b border-transparent hover:text-gray-800 hover:border-b-black transition-all"}>P2P</a>
                    <div className="w-[1px] h-5 flex bg-gray-200"></div>
                    <a href="/withdraw" className={active === 4 ? "text-black font-medium border-b border-b-black" : "text-gray-500 border-b border-transparent hover:text-gray-800 hover:border-b-black transition-all"}>Withdraw</a>
                    <a href="#" className={active === 5 ? "text-black font-medium border-b border-b-black" : "text-gray-500 border-b border-transparent hover:text-gray-800 hover:border-b-black transition-all"}>Settings</a>
                </div>
            </nav>
        </>
    )
}