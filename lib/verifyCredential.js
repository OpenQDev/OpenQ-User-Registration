// Third Party
const axios = require('axios');

// Issue Query
const GET_VIEWER = require('./query/GET_VIEWER');

// Errors
const {
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	UNKNOWN_ERROR,
	RATE_LIMITED,
	RATE_LIMITED_PAT
} = require('../errors');

/***
 *  Verifies the OAuth token holder matches 
 * ***/
const verifyCredential = async (userId, token) => {
	return new Promise(async (resolve, reject) => {
		try {
			const resultViewer = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: GET_VIEWER
					},
					{
						headers: {
							'Authorization': 'token ' + token,
						},
					}
				);

			if (resultViewer.data.errors && resultViewer.data.errors[0].type == 'RATE_LIMITED') {
				return reject(RATE_LIMITED({ issueUrl }));
			}

			const viewerUserId = resultViewer.data.data.viewer.id;

			if (viewerUserId == userId) {
				return resolve({ viewerIsValid: true });
			} else {
				return resolve({ viewerIsValid: false });
			}
		} catch (error) {
			console.error(error);
			if (error.response && error.response.status == 401) {
				console.error(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ issueUrl }));
				return reject(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ issueUrl }));
			}
			return reject(UNKNOWN_ERROR({ issueUrl, error }));
		}
	});
};

module.exports = verifyCredential;