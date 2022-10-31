const cookie = require('cookie-signature');

// This class with a single 
const unsignOauthToken = (prefixedAndSignedOAuthToken, cookieSigner) => {
	return cookie.unsign(prefixedAndSignedOAuthToken.slice(2), cookieSigner);
};

module.exports = unsignOauthToken;