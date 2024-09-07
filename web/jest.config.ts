import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // @를 rootDir로 매핑
  },

  testRegex: ".*\\.spec\\.(ts|tsx)$",
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/client' }),
};
module.exports = createJestConfig(customJestConfig);