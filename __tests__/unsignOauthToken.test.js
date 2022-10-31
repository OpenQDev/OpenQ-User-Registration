const cookie = require('cookie-signature');
const unsignOauthToken = require('../lib/unsignOauthToken');

describe('validateSignedOauthToken', () => {
	const oauthToken = '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';
	const cookieSigner = 'development';
	const signedOauthToken = cookie.sign(oauthToken, cookieSigner);

	// Since we use cookie-parser Express.js middleware, we receive a token prefixed with the s: signed token identifier
	// This must be removed before unsigning the cookie
	const prefixedSignedOAuthToken = `s:${signedOauthToken}`;

	it('returns unsigned, original GitHub OAuth token when given a valid, signed cookie directly from x-authorization header with the s: prefix', async () => {
		const unsignedOauthToken = unsignOauthToken(prefixedSignedOAuthToken, cookieSigner);
		expect(unsignedOauthToken).toEqual(oauthToken);
	});

	it('returns false if given an invalid signed token', async () => {
		const oauthTokenSignedWithUnknownKey = cookie.sign(oauthToken, 'someRandomString');
		const unsignedOauthToken = unsignOauthToken(oauthTokenSignedWithUnknownKey, cookieSigner);
		expect(unsignedOauthToken).toEqual(false);
	});
});