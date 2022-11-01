// Third Party
const axios = require('axios');

// Issue Query
const GET_VIEWER = require('./query/GET_VIEWER');

// Errors
const {
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	UNKNOWN_ERROR,
	RATE_LIMITED
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
				return reject(RATE_LIMITED({ userId }));
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
				console.error(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ userId }));
				return reject(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ userId }));
			}
			return reject(UNKNOWN_ERROR({ userId, error }));
		}
	});
};

module.exports = verifyCredential;