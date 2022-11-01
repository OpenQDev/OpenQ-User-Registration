const verifyCredential = require('../lib/verifyCredential');
const {
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	RATE_LIMITED
} = require('../errors');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('verifyCredential', () => {
	let oauthToken = 'oAuthToken';
	let mock;
	const viewerData = {
		data: { viewer: { login: 'FlacoJones', id: 'abc123!' } }
	};

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	beforeEach(() => {
		mock.reset();
	});

	describe('verifyCredential Pre-Requisites', () => {
		const userId = 'abc123!';

		it('should reject with RATE_LIMITED error if resultViewer is RATE_LIMITED', async () => {
			// ARRANGE
			const resultViewerError = { errors: [{ type: 'RATE_LIMITED' }] };
			mock.onPost('https://api.github.com/graphql').replyOnce(200, resultViewerError);

			// ACT/ASSERT
			await expect(verifyCredential(userId, oauthToken)).rejects.toEqual(RATE_LIMITED({ userId }));
		});

		it('should reject with GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES error if GitHub returns a 401', async () => {
			// ARRANGE
			mock.onPost('https://api.github.com/graphql').reply(401);

			// ACT/ASSERT
			await expect(verifyCredential(userId, oauthToken)).rejects.toEqual(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ userId }));
		});
	});

	describe('Correctly determines if the viewer (OAuth token bearer) owns the Github User Id they want to update', () => {
		const userId = 'abc123!';

		describe('Eligible', () => {
			it('should resolve viewerIsValid true if true', async () => {
				// ARRANGE
				mock
					.onPost('https://api.github.com/graphql')
					.replyOnce(200, viewerData);

				// ACT/ASSERT
				await expect(verifyCredential(userId, oauthToken)).resolves.toEqual({ 'viewerIsValid': true });
			});
		});

		describe('Ineligible', () => {
			it('should resolve viewerIsValid false if false', async () => {
				// ARRANGE
				const viewerDataIncorrect = {
					data: { viewer: { login: 'FlacoJones', id: 'notIt' } }
				};

				mock
					.onPost('https://api.github.com/graphql')
					.replyOnce(200, viewerDataIncorrect);

				// ACT/ASSERT
				await expect(verifyCredential(userId, oauthToken)).resolves.toEqual({ 'viewerIsValid': false });
			});
		});
	});
});
