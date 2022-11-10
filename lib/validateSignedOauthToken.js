const { NO_GITHUB_OAUTH_TOKEN, INVALID_GITHUB_OAUTH_TOKEN } = require('../errors');
const unsignOauthToken = require('./unsignOauthToken');

const STAGING_AUTOTASK_ID = 'f8ecf46b-c14a-466e-a9c9-138006be1a27';
const PRODUCTION_AUTOTASK_ID = '85e04325-4fb9-4aee-bd6c-01d004652a70';

const validateSignedOauthToken = (payoutAddress, event) => {
	return new Promise(async (resolve, reject) => {

		let cookieSigner;
		switch (event.autotaskId) {
			case STAGING_AUTOTASK_ID:
				cookieSigner = event.secrets.COOKIE_SIGNER_STAGING;
				break;
			case PRODUCTION_AUTOTASK_ID:
				cookieSigner = event.secrets.COOKIE_SIGNER_PRODUCTION;
				break;
			default:
				cookieSigner = event.secrets.COOKIE_SIGNER;
		}

		let signedOAuthToken;
		if (event.request && event.request.headers) {
			signedOAuthToken = event.request.headers['x-authorization'];
			if (!signedOAuthToken) {
				signedOAuthToken = event.request.headers['X-Authorization'];
			}
			if (!signedOAuthToken) {
				return reject(NO_GITHUB_OAUTH_TOKEN({ payoutAddress }));
			}
		} else {
			return reject(NO_GITHUB_OAUTH_TOKEN({ payoutAddress }));
		}

		/* Since we are not using Express.js for this oracle running as a lambda,
			 we must manually unsign the OAuth token from the header */
		const oauthToken = unsignOauthToken(signedOAuthToken, cookieSigner);

		if (!oauthToken) {
			return reject(INVALID_GITHUB_OAUTH_TOKEN({ payoutAddress }));
		}

		return resolve(oauthToken);
	});
};

module.exports = validateSignedOauthToken;