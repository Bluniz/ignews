module.exports = {
  //? Pastas para ignorar, ou seja não vai procurar quando for fazer testes
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  //! Um array de arquivos que jest deve executar antes dos testes
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  //? Para arquivos com ts, converta de forma que o jest entenda.
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  //? Em que ambiente nossos testes estão executando
  testEnvironment: "jsdom",
};
