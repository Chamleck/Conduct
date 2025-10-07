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
      // =========================
      // CUSTOM CYPRESS TASKS
      // =========================
      on("task", {
        setMyUniqueValue: (val: string) => {
          myUniqueValue = val;
          return null;
        },
        getMyUniqueValue: () => myUniqueValue,

        // Create user (seed) in DB using Prisma
        seedUser: async (userData: { email: string; username: string; password: string }) => {
          const path = process.env.DATABASE_URL || "file:./database.sqlite";
          console.log("🧭 Using DATABASE_URL:", path);

          const { PrismaClient } = require("@prisma/client");
          const prisma = new PrismaClient({ datasources: { db: { url: path } } });
          const bcrypt = require("bcryptjs");

          console.log("🌱 START seedUser TASK");

          try {
            const { email, username, password } = userData;
            if (!email || !username || !password) {
              console.warn("⚠️ Missing required fields (email, username, password).");
              return { success: false, message: "Missing required fields", user: null };
            }

            let user = await prisma.user.findUnique({ where: { email } });
            if (user) {
              console.log(`ℹ️ User "${email}" already exists.`);
            } else {
              console.log("🔒 Hashing password...");
              const hashedPassword = await bcrypt.hash(password, 10);

              console.log(`🧾 Creating user "${username}" with email "${email}"...`);
              user = await prisma.user.create({
                data: { email, username, passwordHash: hashedPassword },
              });
              console.log(`✅ User "${user.email}" successfully created.`);
            }

            return { success: true, user };
          } catch (err: any) {
            console.error("❌ seedUser error:", err?.message || err);
            return { success: false, message: err?.message || "Unknown error", user: null };
          } finally {
            await prisma.$disconnect();
            console.log("🔚 END seedUser TASK");
          }
        },

        // Delete user by email
        deleteUser: async (email: any) => {
          const path = process.env.DATABASE_URL || "file:./database.sqlite";
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

        // Delete article by title
        deleteArticle: async (title: any) => {
          const path = process.env.DATABASE_URL || "file:./database.sqlite";
          console.log("🧭 Using DATABASE_URL:", path);

          const { PrismaClient } = require("@prisma/client");
          const prisma = new PrismaClient({ datasources: { db: { url: path } } });

          try {
            if (!title) return { success: false, message: "No title provided" };

            const result = await prisma.article.deleteMany({
              where: { title: { contains: String(title) } },
            });

            console.log(`✅ Deleted ${result.count} article(s) matching "${title}"`);
            return { success: true, deleted: result.count };
          } catch (err: any) {
            console.warn("⚠️ deleteArticle warning:", err?.message || err);
            return { success: false, message: err?.message || "Unknown error" };
          } finally {
            await prisma.$disconnect();
          }
        },
      });

      // =========================
      // AFTER:RUN EVENT LISTENER
      // =========================
      /**
       * This event is triggered automatically after **all** Cypress spec files finish running.
       * Its purpose is to:
       * 1. Locate all individual Mochawesome JSON reports (created per spec file).
       * 2. Merge them into a single combined JSON file using `mochawesome-merge`.
       * 3. Generate one unified HTML report using `mochawesome-report-generator`.
       */
      // ============= EVENT LISTENERS =============
      // =======================
      // AFTER:RUN — MERGE & HTML
      // =======================
      on("after:run", async () => {
        // Use absolute paths to avoid platform-specific glob issues
        const reportDir = path.resolve("cypress/reports/mochawesome");
        const mergedJsonName = "mochawesome.json"; // generator often expects this filename
        const mergedJsonPath = path.join(reportDir, mergedJsonName);

        console.log("📊 Starting report merge process...");

        // 1) If report folder doesn't exist — skip
        if (!fs.existsSync(reportDir)) {
          console.log("⚠️ Report directory not found — skipping report generation.");
          return;
        }

        // 2) Collect JSON files that are individual spec outputs.
        //    Exclude any previously merged file or index.* files to avoid loops.
        const jsonFiles = fs
          .readdirSync(reportDir)
          .filter(
            (f) =>
              f.endsWith(".json") &&
              !f.includes(mergedJsonName) && // exclude merged file if exists
              !f.toLowerCase().includes("index") // avoid index.json/html leftovers
          )
          .map((f) => path.join(reportDir, f));

        if (jsonFiles.length === 0) {
          console.log("⚠️ No JSON reports found — nothing to merge.");
          return;
        }

        console.log(`🧩 Found ${jsonFiles.length} JSON report(s) to merge:`);
        jsonFiles.forEach((p) => console.log("   -", p));

        try {
          // 3) Merge JSONs into one object (mochawesome-merge)
          const mergedReport = await merge({ files: jsonFiles });

          // Basic sanity check: mergedReport should contain results
          if (!mergedReport || !mergedReport.results || mergedReport.results.length === 0) {
            console.error("❌ Merged report structure is empty or invalid. Aborting HTML generation.");
            return;
          }

          // 4) Write merged JSON to disk synchronously so generator can find it by path
          fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedReport, null, 2), "utf8");
          console.log("🧾 Merged JSON saved:", mergedJsonPath);
          console.log("   exists:", fs.existsSync(mergedJsonPath));

          // 5) Try to generate HTML from the merged JSON file (preferred)
          try {
            await marge.create(mergedJsonPath, {
              reportDir,
              reportFilename: "index",
              inlineAssets: true, // standalone HTML
              saveJson: false,
              charts: true,
              reportTitle: "Cypress Test Report",
              reportPageTitle: "E2E Results",
              overwrite: true,
            });

            console.log("✅ HTML report successfully created:", path.join(reportDir, "index.html"));

            // 6) Cleanup: remove the individual JSONs we just merged (keep merged file)
            jsonFiles.forEach((file) => {
              try { fs.unlinkSync(file); } catch (e) { /* ignore */ }
            });
            console.log("🧹 Individual JSON reports removed after successful merge.");

            return; // success path done
          } catch (primaryErr: any) {
            // If generator failed for file-based path, log and try fallback
            console.warn("⚠️ Primary HTML generation failed (file path). Trying fallback... ", primaryErr?.message || primaryErr);
          }

          // 7) FALLBACK: try to generate HTML by passing the merged object directly.
          //    Some versions/edge-cases of the generator accept the object instead of path.
          try {
            await marge.create(mergedReport, {
              reportDir,
              reportFilename: "index",
              inlineAssets: true,
              saveJson: false,
              charts: true,
              reportTitle: "Cypress Test Report",
              reportPageTitle: "E2E Results",
              overwrite: true,
            });

            console.log("✅ HTML report created using fallback (object input):", path.join(reportDir, "index.html"));

            // Clean up individual JSONs after success
            jsonFiles.forEach((file) => {
              try { fs.unlinkSync(file); } catch (e) { /* ignore */ }
            });
            console.log("🧹 Individual JSON reports removed after successful fallback merge.");

            return;
          } catch (fallbackErr: any) {
            // 8) If fallback also fails – write detailed diagnostics for debugging.
            console.error("❌ Fallback HTML generation also failed:", fallbackErr?.message || fallbackErr);

            // Write a diagnostics file to help debugging
            try {
              const diagPath = path.join(reportDir, "marge-error-diagnostics.json");
              const diag = {
                timestamp: new Date().toISOString(),
                jsonFiles,
                mergedExists: fs.existsSync(mergedJsonPath),
                mergedSize: fs.existsSync(mergedJsonPath) ? fs.statSync(mergedJsonPath).size : 0,
                errorPrimary: String(fallbackErr),
              };
              fs.writeFileSync(diagPath, JSON.stringify(diag, null, 2), "utf8");
              console.log("📝 Diagnostics written to:", diagPath);
            } catch (diagErr) {
              console.warn("⚠️ Failed writing diagnostics:", diagErr);
            }

            return;
          }
        } catch (err: any) {
          console.error("❌ Error during merge step:", err?.message || err);
          // nothing else to do
          return;
        }
      });

      
      // =========================
      // REPORTER CONFIGURATION
      // =========================
      config.reporter = "mochawesome";
      config.reporterOptions = {
        reportDir: "cypress/reports/mochawesome",
        overwrite: false, // ensures each spec produces a unique JSON
        html: false,      // disables per-spec HTML to save time
        json: true,       // only generate JSON, HTML is generated later
        timestamp: "mm-dd-yyyy_HH-MM-ss",
      };

      // Enable video recording & screenshots
      config.video = true;
      config.screenshotOnRunFailure = true;

      return config;
    },
  },

  video: true,
  screenshotOnRunFailure: true,
});
