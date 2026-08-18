/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "perTest",
  mutate: [
    "src/lib/**/*.js",
    "src/pages/Advisory.jsx",
    "src/pages/WaterCalculator.jsx",
    "src/pages/FertilizerCalculator.jsx",
    "!src/**/*.test.{js,jsx}",
  ],
  jest: {
    configFile: "jest.config.cjs",
  },
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },
};

export default config;
