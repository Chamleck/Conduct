import { defineConfig } from "cypress";
const { merge } = require("mochawesome-merge");
const marge = require("mochawesome-report-generator");
import fs from "fs";
import path from "path";

var myUniqueId: string | undefined;

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "tests/**/*.spec.ts",
    retries: {
      runMode: 1,
      openMode: 0,
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 100000,
    watchForFileChanges: false,
    viewportWidth: 1920,
    viewportHeight: 1080,

    setupNodeEvents(on, config) {
      // Tasks to store / retrieve unique ID
      on("task", {
        setMyUniqueId: (val: string) => {
          myUniqueId = val;
          return null;
        },
        getMyUniqueId: () => myUniqueId,
        
        // Generating Mochawesome report after tests
        async generateMochawesomeReport() {
          const reportDir = "cypress/reports/mochawesome";
          if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
          }

          // Собираем все JSON отчёты
          const jsonFiles = fs
            .readdirSync(reportDir)
            .filter((file) => file.endsWith(".json"))
            .map((file) => path.join(reportDir, file));

          if (jsonFiles.length === 0) return null;

          // Merge reports
          const mergedReport = await merge({ files: jsonFiles });

          // Generate final report
          await marge.create(mergedReport, {
            reportDir,
            inlineAssets: true,
            saveJson: true,
          });

          return null;
        },
      });

      // Reporter configuration
      config.reporter = "mochawesome";
      config.reporterOptions = {
        reportDir: "cypress/reports/mochawesome",
        overwrite: true,
        html: true,
        json: true,
      };

      // Video and screenshot settings
      config.video = true;
      config.screenshotOnRunFailure = true;

      return config;
    },
  },

  video: true,
  screenshotOnRunFailure: true,
});
