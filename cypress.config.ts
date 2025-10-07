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
        // Cypress task to "seed" (create or ensure existence of) a user in the database.
        // This is useful for E2E tests where we need a predictable user account
        // to log in with, without relying on manual DB setup.
        seedUser: async (userData: { email: string; username: string; password: string }) => {
          // Determine which database to connect to.
          // First, check if DATABASE_URL is defined (from .env).
          // If not, default to local SQLite file.
          const path = process.env.DATABASE_URL || 'file:./database.sqlite';
          console.log("🧭 Using DATABASE_URL:", path);

          // Import Prisma client dynamically inside the task
          // (to avoid issues with bundling and Cypress execution context).
          const { PrismaClient } = require("@prisma/client");
          const prisma = new PrismaClient({ datasources: { db: { url: path } } });

          // Import bcrypt for password hashing.
          const bcrypt = require('bcryptjs');

          console.log("🌱 START seedUser TASK");

          try {
            const { email, username, password } = userData;

            // Validate that required fields are provided.
            // If any of them are missing, abort early and return an error object.
            if (!email || !username || !password) {
              console.warn("⚠️ Missing required fields (email, username, password).");
              return { success: false, message: "Missing required fields", user: null };
            }

            // Step 1: Check if a user with this email already exists in the DB.
            // We use Prisma's `findUnique` to query by unique email.
            console.log(`🔍 Checking if user "${email}" already exists...`);
            let user = await prisma.user.findUnique({ where: { email } });

            if (user) {
              // If found, we do NOT create a new one, just return the existing user.
              console.log(`ℹ️ User "${email}" already exists.`);
            } else {
              // Step 2: If no user exists, create a new one.
              // First, hash the plain-text password securely with bcrypt.
              console.log("🔒 Hashing password...");
              const hashedPassword = await bcrypt.hash(password, 10);

              // Step 3: Create the user in the DB with email, username, and hashed password.
              console.log(`🧾 Creating user "${username}" with email "${email}"...`);
              user = await prisma.user.create({
                data: {
                  email,
                  username,
                  passwordHash: hashedPassword,
                },
              });
              console.log(`✅ User "${user.email}" successfully created.`);
            }

            // Step 4: Always return a consistent response object:
            // - success: true
            // - user: the actual user object from DB (existing or newly created).
            return { success: true, user };

          } catch (err: any) {
            // If anything fails during execution, log the error and return failure response.
            console.error("❌ seedUser error:", err?.message || err);
            return { success: false, message: err?.message || "Unknown error", user: null };

          } finally {
            // Ensure Prisma disconnects from DB, avoiding connection leaks
            // (important when Cypress runs multiple tests).
            await prisma.$disconnect();
            console.log("🔚 END seedUser TASK");
          }
        },
        deleteUser: async (email: any) => {
          const path = process.env.DATABASE_URL || 'file:./database.sqlite';
          console.log("🧭 Using DATABASE_URL:", path);

          const { PrismaClient } = require("@prisma/client");
          const prisma = new PrismaClient({ datasources: { db: { url: path } } });

          console.log("🔍 START deleteUser TASK");

          try {
            if (!email) {
              console.warn("⚠️ No email provided — skipping user deletion to avoid mass delete.");
              return { success: false, message: "No email provided" };
            }

            console.log(`🧾 Checking if user with email "${email}" exists...`);
            const user = await prisma.user.findUnique({ where: { email: String(email) } });

            if (!user) {
              console.log(`ℹ️ User "${email}" not found in DB — nothing to delete.`);
              return { success: true, deleted: 0 };
            }

            console.log(`🗑️ Deleting user "${email}"...`);
            const result = await prisma.user.delete({ where: { email: String(email) } });

            console.log(`✅ User "${result.email}" successfully deleted.`);
            return { success: true, deleted: 1 };
          } catch (err: any) {
            console.warn("⚠️ deleteUser warning:", err?.message || err);
            return { success: false, message: err?.message || "Unknown error" };
          } finally {
            await prisma.$disconnect();
            console.log("🔚 END deleteUser TASK");
          }
        },
        deleteArticle: async (title: any) => {
          const path = process.env.DATABASE_URL || 'file:./database.sqlite';
          console.log("🧭 Using DATABASE_URL:", path);

          const { PrismaClient } = require("@prisma/client");
          const prisma = new PrismaClient({ datasources: { db: { url: path } } });

          try {
            if (!title) return { success: false, message: 'No title provided' };

            const result = await prisma.article.deleteMany({
              where: { title: { contains: String(title) } }, // without mode
            });

            console.log(`✅ Deleted ${result.count} article(s) matching "${title}"`);
            return { success: true, deleted: result.count };
          } catch (err: any) {
            console.warn("⚠️ deleteArticle warning:", err?.message || err);
            return { success: false, message: err?.message || 'Unknown error' };
          } finally {
            await prisma.$disconnect();
          }
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
