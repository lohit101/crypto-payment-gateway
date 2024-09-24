export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "jsonData",
				"type": "string"
			}
		],
		"name": "JsonStored",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getJson",
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
				"name": "jsonData",
				"type": "string"
			}
		],
		"name": "storeJson",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "storedJson",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const CONTRACT_ADDRESS = "0x6fcEaFB06007490c6a10607edBc8047ed435839F"