module.exports = {
	"roots": [
		"<rootDir>/test"
	],
	"testMatch": [
		"**/?(*.)+(spec|test).+(ts|tsx|js)"
	],
	"transform": {
		"^.+\\.(ts|tsx)$": "ts-jest"
	},
	"collectCoverage": true,
	"moduleNameMapper": {
		"@server/(.*)": "<rootDir>/src/server/$1"
	}
};
