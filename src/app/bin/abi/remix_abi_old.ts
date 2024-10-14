// /lib/abi.ts
export const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "getString",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "myString",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_myString",
                "type": "string"
            }
        ],
        "name": "setString",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const CONTRACT_ADDRESS = "0x0C82E40582e0167455421A6D8e3D7CAf7Bf51056"; // Replace with your contract address
