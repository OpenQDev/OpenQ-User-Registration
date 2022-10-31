const MockOpenQContract = {
	associateExternalIdToAddress: async (userId, userAddress, options, hash = '0x123abc') => {
		return new Promise(async (resolve, reject) => {
			resolve({ hash });
		});
	}
};

module.exports = MockOpenQContract;