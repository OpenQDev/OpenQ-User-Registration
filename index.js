// Helper methods
const main = require('./main');
const OPENQ_ABI = require('./OpenQABI.json');
const STAGING_AUTOTASK_ID = 'f8ecf46b-c14a-466e-a9c9-138006be1a27';
const PRODUCTION_AUTOTASK_ID = '85e04325-4fb9-4aee-bd6c-01d004652a70';

// Autotask Entrypoint - constructs signer and contract using Relay
exports.handler = async (event) => {
	let OPENQ_PROXY_ADDRESS;

	switch (event.autotaskId) {
		case STAGING_AUTOTASK_ID:
			OPENQ_PROXY_ADDRESS = event.secrets.OPENQ_PROXY_ADDRESS_STAGING;
			break;
		case PRODUCTION_AUTOTASK_ID:
			OPENQ_PROXY_ADDRESS = event.secrets.OPENQ_PROXY_ADDRESS_PRODUCTION;
			break;
		default:
			OPENQ_PROXY_ADDRESS = event.secrets.OPENQ_PROXY_ADDRESS;
	}

	console.log('OPENQ PROXY ADDRESS', OPENQ_PROXY_ADDRESS);

	const { DefenderRelayProvider, DefenderRelaySigner } = require('defender-relay-client/lib/ethers');
	const { ethers } = require('ethers');

	// Initialize Defender Relay Signer
	const provider = new DefenderRelayProvider(event);
	const signer = new DefenderRelaySigner(event, provider, { speed: 'fastest' });

	// Prepare OpenQ Contract for call
	const openQ = new ethers.Contract(OPENQ_PROXY_ADDRESS, OPENQ_ABI, signer);

	// We then run the main logic in the main function
	try {
		const result = await main(event, openQ);
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