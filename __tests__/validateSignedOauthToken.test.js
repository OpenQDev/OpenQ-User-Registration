const validateSignedOauthToken = require('../lib/validateSignedOauthToken');
const cookie = require('cookie-signature');

describe('validateSignedOauthToken', () => {
	const oauthToken = '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';
	const cookieSigner = 'development';
	const signedOauthToken = cookie.sign(oauthToken, cookieSigner);

	// Since we use cookie-parser Express.js middleware, we receive a token prefixed with the s: signed token identifier
	// This must be removed before unsigning the cookie
	const prefixedSignedOAuthToken = `s:${signedOauthToken}`;

	const payoutAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

	it('should return NO_GITHUB_OAUTH_TOKEN if no headers are present', async () => {
		const noHeadersEvent = {
			secrets: {
				COOKIE_SIGNER: cookieSigner
			},
			request: {}
		};

		expect(validateSignedOauthToken(payoutAddress, noHeadersEvent)).rejects.toEqual({ 'canWithdraw': false, 'errorMessage': 'No GitHub OAuth token. You must sign in.', 'id': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'type': 'NO_GITHUB_OAUTH_TOKEN' });
	});

	it('should return NO_GITHUB_OAUTH_TOKEN if no x-authorization header is present', async () => {
		const noXAuthorizationHeaderEvent = {
			secrets: {
				COOKIE_SIGNER: cookieSigner
			},
			request: {
				headers: {
					'foo': 'bar'
				}
			}
		};

		expect(validateSignedOauthToken(payoutAddress, noXAuthorizationHeaderEvent)).rejects.toEqual({ 'canWithdraw': false, 'errorMessage': 'No GitHub OAuth token. You must sign in.', 'id': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'type': 'NO_GITHUB_OAUTH_TOKEN' });
	});

	it('should return INVALID_GITHUB_OAUTH_TOKEN if no x-authorization header is invalid', async () => {
		const invalidXAuthorizationHeaderEvent = {
			secrets: {
				COOKIE_SIGNER: cookieSigner
			},
			request: {
				headers: {
					'x-authorization': 's:gho_IDONOTWORK'
				}
			}
		};

		expect(validateSignedOauthToken(payoutAddress, invalidXAuthorizationHeaderEvent)).rejects.toEqual({ 'canWithdraw': false, 'errorMessage': 'Invalid GitHub OAuth toke unsigned by OpenQ', 'id': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'type': 'INVALID_GITHUB_OAUTH_TOKEN' });
	});

	it('should resolve with unsigned oauthToken all goes well', async () => {
		const validXAuthorizationHeaderEvent = {
			secrets: {
				COOKIE_SIGNER: cookieSigner
			},
			request: {
				headers: {
					'x-authorization': prefixedSignedOAuthToken
				}
			}
		};

		expect(validateSignedOauthToken(payoutAddress, validXAuthorizationHeaderEvent)).resolves.toEqual(oauthToken);
	});
});