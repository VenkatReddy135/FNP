module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/setupTests.js"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__tests__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/__tests__/styleMock.js",
  },
};
