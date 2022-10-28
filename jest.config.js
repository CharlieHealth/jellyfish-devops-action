const modulesToTransform = ['axios'].join('|');

module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest',
  transformIgnorePatterns: [`/node_modules/(?!${modulesToTransform})`],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  verbose: true
}
