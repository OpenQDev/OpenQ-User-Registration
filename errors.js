const INVALID_GITHUB_OAUTH_TOKEN = ({ payoutAddress }) => {
	return { id: payoutAddress, canWithdraw: false, type: 'INVALID_GITHUB_OAUTH_TOKEN', errorMessage: 'Invalid GitHub OAuth toke unsigned by OpenQ' };
};

const NO_GITHUB_OAUTH_TOKEN = ({ payoutAddress }) => {
	return { id: payoutAddress, canWithdraw: false, type: 'NO_GITHUB_OAUTH_TOKEN', errorMessage: 'No GitHub OAuth token. You must sign in.' };
};

const GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES', errorMessage: 'Your GitHub OAuth token is not authorized to access this resource' };
};

const PR_NOT_MERGED = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'PR_NOT_MERGED', errorMessage: 'The PR associated to this contract is not yet merged.' };
};

const ISSUE_DOES_NOT_EXIST = ({ issueUrl }) => {
	return { canWithdraw: false, type: 'NOT_FOUND', errorMessage: `No issue found with url ${issueUrl}` };
};

const ISSUE_NOT_CLOSED = ({ issueId, issueUrl }) => {
	return { issueId, canWithdraw: false, type: 'NOT_CLOSED', errorMessage: `The issue at ${issueUrl} is still open on GitHub.` };
};

const ISSUE_NOT_CLOSED_BY_PR = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'ISSUE_NOT_CLOSED_BY_PR', errorMessage: 'Issue was not closed by a PR' };
};

const PR_NOT_AUTHORED_BY_USER = ({ issueId, issueUrl, viewer, prAuthor }) => {
	return { issueId, canWithdraw: false, type: 'PR_NOT_AUTHORED_BY_USER', errorMessage: `PR linked to issue ${issueUrl} was not closed by ${viewer}. It was closed by ${prAuthor}` };
};

const PR_NOT_MERGED_INTO_ORGANIZATION_REPOSITORY = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'PR_NOT_MERGED_INTO_ORGANIZATION_REPOSITORY', errorMessage: 'PR not merged into organization repository.' };
};

const BOUNTY_IS_CLAIMED = ({ issueUrl, payoutAddress }) => {
	return { canWithdraw: false, id: payoutAddress, type: 'BOUNTY_IS_CLAIMED', errorMessage: `Contract for ${issueUrl} is already claimed` };
};

const ONGOING_ALREADY_CLAIMED = ({ issueUrl, payoutAddress, claimant, claimantAsset }) => {
	return { canWithdraw: false, id: payoutAddress, type: 'BOUNTY_IS_CLAIMED', errorMessage: `Split-price contract for ${issueUrl} has already been claimed by ${claimant} for ${claimantAsset}.` };
};

const BOUNTY_IS_INSOLVENT = ({ issueUrl, payoutAddress }) => {
	return { canWithdraw: false, id: payoutAddress, type: 'BOUNTY_IS_INSOLVENT', errorMessage: `Split-price contract for ${issueUrl} has insufficient funds to payout this eligible withdrawl. Please contact the organization maintainer.` };
};

const TIER_ALREADY_CLAIMED = ({ issueUrl, payoutAddress, claimant, claimantAsset, tier }) => {
	return { canWithdraw: false, id: payoutAddress, type: 'TIER_IS_CLAIMED', errorMessage: `Contest contract for ${issueUrl} at tier ${tier} has already been claimed by ${claimant} for ${claimantAsset}.` };
};

const UNKNOWN_ERROR = ({ issueUrl, error }) => {
	return { issueUrl, canWithdraw: false, type: 'UNKNOWN_ERROR', errorMessage: JSON.stringify(error) };
};

const NO_WITHDRAWABLE_PR_FOUND = ({ issueId, referencedPrs }) => {
	const pullRequests = referencedPrs.map(pr => pr.url).join(',');
	return {
		issueId, canWithdraw: false, type: 'NO_WITHDRAWABLE_PR_FOUND', errorMessage: `No withdrawable PR found.  In order for a pull request to unlock a claim, it must mention the associated bountied issue, be authored by you and merged by a maintainer. We found the following linked pull requests that do not meet the above criteria: ${pullRequests}`
	};
};

const NO_CLOSER_COMMENT_AT_MERGE_TIME = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'NO_CLOSER_COMMENT_AT_MERGE_TIME', errorMessage: 'There was no Closer comment on any pull request referencing this issue' };
};

const NO_PULL_REQUESTS_REFERENCE_ISSUE = ({ issueId }) => {
	return { issueId, canWithdraw: false, type: 'NO_PULL_REQUESTS_REFERENCE_ISSUE', errorMessage: 'No pull requests reference this issue.' };
};

const RATE_LIMITED = ({ issueUrl }) => {
	return { issueUrl, canWithdraw: false, type: 'RATE_LIMITED', errorMessage: 'It appears the Github user you are attempting to claim with has been rate limited by the API. Have you been using the API extensively lately? Please attempt claim again in one hour' };
};

const RATE_LIMITED_PAT = ({ issueUrl }) => {
	return { issueUrl, canWithdraw: false, type: 'RATE_LIMITED_PAT', errorMessage: 'It appears we are being rate limited by Github...please attempt claim in one hour.' };
};

module.exports = {
	INVALID_GITHUB_OAUTH_TOKEN,
	NO_CLOSER_COMMENT_AT_MERGE_TIME,
	NO_GITHUB_OAUTH_TOKEN,
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	PR_NOT_MERGED,
	ISSUE_DOES_NOT_EXIST,
	NO_PULL_REQUESTS_REFERENCE_ISSUE,
	ISSUE_NOT_CLOSED,
	ISSUE_NOT_CLOSED_BY_PR,
	PR_NOT_AUTHORED_BY_USER,
	PR_NOT_MERGED_INTO_ORGANIZATION_REPOSITORY,
	BOUNTY_IS_CLAIMED,
	NO_WITHDRAWABLE_PR_FOUND,
	UNKNOWN_ERROR,
	ONGOING_ALREADY_CLAIMED,
	TIER_ALREADY_CLAIMED,
	BOUNTY_IS_INSOLVENT,
	RATE_LIMITED,
	RATE_LIMITED_PAT
};