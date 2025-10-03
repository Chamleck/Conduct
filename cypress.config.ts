import { defineConfig } from "cypress";
const { merge } = require("mochawesome-merge");
const marge = require("mochawesome-report-generator");
import fs from "fs";
import path from "path";

var myUniqueValue: string | undefined;

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
        setMyUniqueValue: (val: string) => {
          myUniqueValue = val;
          return null;
        },
        getMyUniqueValue: () => myUniqueValue,
        // Task to delete a user by email using Prisma
        // Tipisation any - because Cypress tasks do not support generics
        deleteUser: async (email: any) => {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();
      try {
        if (!email) return null; // protecting against accidental deletion of all users
        await prisma.user.delete({ where: { email: String(email) } });
        console.log(`User ${email} deleted`);
      } catch (err: any) {
        console.warn("deleteUser warning:", err?.message || err);
      } finally {
        await prisma.$disconnect();
      }
      return null;
    },



        // Generating Mochawesome report after tests
        async generateMochawesomeReport() {
          const reportDir = "cypress/reports/mochawesome";
          if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
          }

          // collecting all json files
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
