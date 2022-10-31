const dotenv = require('dotenv');
const main = require('../main');
const MockOpenQContract = require('../__mocks__/MockOpenQContract');
dotenv.config();

/* 
INTEGRATION TEST

This is an integration test which makes live calls to the GitHub GraphQL API.

As such, before testing you must provide a valid GitHub OAuth token signed by COOKIE_SIGNER in .env before running.

To do so, start a Node console and run:

const cookie = require('cookie-signature');
cookie.sign('<your gho token>', '<your COOKIE_SIGNER>')

for example:
cookie.sign('gho_vshjeyuyuy34', 'entropy123')
*/
describe('main', () => {
	let event;
	let userAddress = '0x1abc0D6fb0d5A374027ce98Bf15716A3Ee31e580';
	let userId = 'U_kgDOBZIDuA'; // This is the Github User ID of flacojones
	let apiKey = 'mockApiKey';
	let apiSecret = 'mockApiSecret';

	beforeEach(() => {
		event = {
			request: {
				body: {
					userId,
					userAddress
				},
				headers: {
					'x-authorization': process.env.SIGNED_OAUTH_TOKEN
				}
			},
			secrets: {
				COOKIE_SIGNER: process.env.COOKIE_SIGNER,
				OPENQ_PROXY_ADDRESS: process.env.OPENQ_PROXY_ADDRESS,
			},
			apiKey,
			apiSecret,
		};
	});

	describe('ELIGIBLE', () => {
		describe('CAN UPDATE ADDRES', () => {
			it('should resolve with userId, userAddress and txnHash for properly referenced issue - pull request body, no edits', async () => {
				await expect(main(event, MockOpenQContract)).resolves.toEqual({ userId, userAddress, txnHash: '0x123abc' });
			});
		});
	});
});