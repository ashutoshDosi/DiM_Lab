module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  testMatch: ["<rootDir>/src/**/*.test.{js,jsx}"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/jest.styleMock.cjs",
  },
  clearMocks: true,
};
