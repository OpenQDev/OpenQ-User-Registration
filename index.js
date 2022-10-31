// Helper methods
const main = require('./main');
const OPENQ_ABI = require('./OpenQABI.json');
const CLAIM_MANAGER_ABI = require('./ClaimManagerABI.json');
const STAGING_AUTOTASK_ID = '27766ed2-4997-42b7-bfd5-43dfe20acb2c';
const PRODUCTION_AUTOTASK_ID = '1224e6b1-20f6-4f55-96b1-f9cf0683ebc8';

// Autotask Entrypoint - constructs signer and contract using Relay
exports.handler = async (event) => {
	let OPENQ_PROXY_ADDRESS;
	let CLAIM_MANAGER_PROXY_ADDRESS;
	console.log('event.autotaskId', event.autotaskId);
	switch (event.autotaskId) {
		case STAGING_AUTOTASK_ID:
			OPENQ_PROXY_ADDRESS = event.secrets.OPENQ_PROXY_ADDRESS_STAGING;
			CLAIM_MANAGER_PROXY_ADDRESS = event.secrets.CLAIM_MANAGER_PROXY_ADDRESS_STAGING;
			break;
		case PRODUCTION_AUTOTASK_ID:
			OPENQ_PROXY_ADDRESS = event.secrets.OPENQ_PROXY_ADDRESS_PRODUCTION;
			CLAIM_MANAGER_PROXY_ADDRESS = event.secrets.CLAIM_MANAGER_PROXY_ADDRESS_PRODUCTION;
			break;
		default:
			OPENQ_PROXY_ADDRESS = event.secrets.OPENQ_PROXY_ADDRESS;
			CLAIM_MANAGER_PROXY_ADDRESS = event.secrets.CLAIM_MANAGER_PROXY_ADDRESS;
	}

	console.log('OPENQ PROXY ADDRESS', OPENQ_PROXY_ADDRESS);
	console.log('CLAIM_MANAGER_PROXY_ADDRESS', CLAIM_MANAGER_PROXY_ADDRESS);

	const { DefenderRelayProvider, DefenderRelaySigner } = require('defender-relay-client/lib/ethers');
	const { ethers } = require('ethers');

	// Initialize Defender Relay Signer
	const provider = new DefenderRelayProvider(event);
	const signer = new DefenderRelaySigner(event, provider, { speed: 'fastest' });

	// Prepare OpenQ Contract for call
	const openQ = new ethers.Contract(OPENQ_PROXY_ADDRESS, OPENQ_ABI, signer);
	const claimManager = new ethers.Contract(CLAIM_MANAGER_PROXY_ADDRESS, CLAIM_MANAGER_ABI, signer);

	// We then run the main logic in the main function
	try {
		const result = await main(event, openQ, claimManager);
		return result;
	} catch (error) {
		return error;
	}
};

// Local Provider + Contract Setup
if (require.main === module) {
	const app = require('./app');
	const PORT = 8091;
	app.listen(PORT);
	console.log(`Open Zeppelin User Registration Autotask listening on ${PORT}`);
}