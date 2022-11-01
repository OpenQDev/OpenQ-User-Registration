const INVALID_GITHUB_OAUTH_TOKEN = ({ payoutAddress }) => {
	return { id: payoutAddress, canWithdraw: false, type: 'INVALID_GITHUB_OAUTH_TOKEN', errorMessage: 'Invalid GitHub OAuth toke unsigned by OpenQ' };
};

const NO_GITHUB_OAUTH_TOKEN = ({ payoutAddress }) => {
	return { id: payoutAddress, canWithdraw: false, type: 'NO_GITHUB_OAUTH_TOKEN', errorMessage: 'No GitHub OAuth token. You must sign in.' };
};

const GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES', errorMessage: 'Your GitHub OAuth token is not authorized to access this resource' };
};

const UNKNOWN_ERROR = ({ issueUrl, error }) => {
	return { issueUrl, canWithdraw: false, type: 'UNKNOWN_ERROR', errorMessage: JSON.stringify(error) };
};

const RATE_LIMITED = ({ issueUrl }) => {
	return { issueUrl, canWithdraw: false, type: 'RATE_LIMITED', errorMessage: 'It appears the Github user you are attempting to claim with has been rate limited by the API. Have you been using the API extensively lately? Please attempt claim again in one hour' };
};

module.exports = {
	INVALID_GITHUB_OAUTH_TOKEN,
	NO_GITHUB_OAUTH_TOKEN,
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	UNKNOWN_ERROR,
	RATE_LIMITED
};