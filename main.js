const verifyCredentialImpl = require('./lib/verifyCredential');
const validateSignedOauthTokenImpl = require('./lib/validateSignedOauthToken');

const main = async (
	event,
	contract,
	verifyCredential = verifyCredentialImpl,
	validateSignedOauthToken = validateSignedOauthTokenImpl
) => {
	return new Promise(async (resolve, reject) => {
		const { userId, userAddress } = event.request.body;
		console.log(`Attempting set on ${userId} to ${userAddress}`);

		let oauthToken;
		try {
			oauthToken = await validateSignedOauthToken(userAddress, event);
		} catch (error) {
			return reject(error);
		}

		try {
			const { viewerIsValid } = await verifyCredential(userId, oauthToken);

			if (viewerIsValid) {
				const options = { gasLimit: 3000000 };

				const txn = await contract.associateExternalIdToAddress(userId, userAddress, options);

				console.log(`Can update address. Transaction hash is ${txn.hash}.`);
				resolve({ txnHash: txn.hash, userId, userAddress });
			} else {
				reject(`User with ID ${userId} is not able to set address`);
			}
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

module.exports = main;