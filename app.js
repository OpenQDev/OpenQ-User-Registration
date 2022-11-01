const express = require('express');
const ethers = require('ethers');
const main = require('./main');
const OPENQ_ABI = require('./OpenQABI.json');
require('dotenv').config();

const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
	// Construct local signer
	const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
	const contract = new ethers.Contract(process.env.OPENQ_PROXY_ADDRESS, OPENQ_ABI, provider);
	const wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);
	const contractWithWallet = contract.connect(wallet);

	// Prepare data for event
	const { issueUrl, payoutAddress } = req.body;
	const signedOAuthToken = req.headers['x-authorization'];

	// Construct event
	const event = {
		request: {
			body: {
				issueUrl,
				payoutAddress
			},
			headers: {
				'x-authorization': signedOAuthToken
			}
		},
		secrets: {
			COOKIE_SIGNER: process.env.COOKIE_SIGNER,
			OPENQ_PROXY_ADDRESS: process.env.OPENQ_PROXY_ADDRESS,
			PAT: process.env.PAT
		},
		apiKey,
		apiSecret,
	};

	try {
		const result = await main(event, contractWithWallet);

		// On local we mimic the return JSON from OpenZeppelin Autotask
		// The result in production is stringidied, so we do that here
		// https://docs.openzeppelin.com/defender/autotasks#webhook-handler
		const autotaskResult = {
			'autotaskRunId': '37a91eba-9a6a-4404-95e4-38d178ba69ed',
			'autotaskId': '19ef0257-bba4-4723-a18f-67d96726213e',
			'trigger': 'webhook',
			'status': 'success',
			'createdAt': '2021-02-23T18:49:14.812Z',
			'encodedLogs': 'U1RBU...cwkK',
			'result': JSON.stringify(result),
			'requestId': 'e7979150-44d3-4021-926c-9d9679788eb8'
		};

		res.status(200).send(autotaskResult);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = app;