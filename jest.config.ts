import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: [
        "<rootDir>/**/*.test.ts", // 递归匹配所有目录
        "<rootDir>/test/**/*.ts", // 明确匹配 test 目录
    ],
    modulePathIgnorePatterns: ["<rootDir>/dist"],
    transform: {
        "^.+\\.(ts)$": "ts-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts}", "!**/node_modules/**"],
    coverageReporters: ["text", "lcov"],
};

export default config;
