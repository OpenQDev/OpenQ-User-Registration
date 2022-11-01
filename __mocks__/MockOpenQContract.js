const MockOpenQContract = {
	associateExternalIdToAddress: async (userId, userAddress, options, hash = '0x123abc') => {
		return new Promise(async (resolve) => {
			resolve({ hash });
		});
	}
};

module.exports = MockOpenQContract;