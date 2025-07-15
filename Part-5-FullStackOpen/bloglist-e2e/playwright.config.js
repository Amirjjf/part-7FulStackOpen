// playwright.config.js
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    environment: {
      NODE_ENV: "test",
    },
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    timeout: 15000,
    reuseExistingServer: !process.env.CI,
  },
});
