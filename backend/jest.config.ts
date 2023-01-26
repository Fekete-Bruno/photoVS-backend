module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots:["<rootDir>"],
    modulePaths:["<rootDir>"],
    moduleDirectories: ["node_modules", "src"],
    transform: {
      ".+\\.ts$": "ts-jest",
    },
    testMatch: ["<rootDir>/tests/*.(test|spec).ts"],
};