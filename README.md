
# ![STRV Test Project for QA / Web Automation](./banner.jpg)

> A test automation template built on top of the [RealWorld](https://github.com/gothinkster/realworld) example application using NextJS + tRPC + Prisma.

This project serves as a template for test automation candidates writing end-to-end tests using any automation framework of their choosing. The application is a fully functional Medium.com copy (Conduit) that provides real-world scenarios for testing.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```
   This will automatically:
   - Install all required packages
   - Set up the database
   - Set up minimal environment configuration

2. **Start the application**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

3. **Run tests**
   ```bash
   npm run test
   ```
   Currently, there is no test command implemented. You can add the test automation command to the `npm run test:run` script in the [package.json](./package.json). Any framework that you choose, make sure that you initialize the database first with `npm run test:initialize:database`.

## 📝 Relevant Scripts

| Script | Description |
|--------|-------------|
| `npm install` | Install dependencies and set up the project |
| `npm run dev` | Start the development server |
| `npm run test:run` | Run end-to-end tests |
| `npm run test:open` | Open Cypress Test Runner in interactive mode |
| `npm run test:run:chrome` | Run tests in Chrome (desktop) |
| `npm run test:run:firefox` | Run tests in Firefox (desktop) |
| `npm run test:run:mobile:chrome` | Run tests in Chrome mobile emulation (375x667 viewport) |
| `npm run test:run:mobile:safari` | Run tests with Safari Mobile emulation (Chromium + Safari userAgent). ⚠️ Note: Cypress does not support Safari natively — this script only simulates Safari Mobile. |

## 🧪 Test Structure

Locate the tests in the `tests/` directory that you will need to create:

Example structure:
```
tests/
├── home.spec.ts          # Homepage tests
└── ...                   # Add your test files here
```

### Test Configuration

Add the following in your config for the end-to-end tests:

- **Retries**: 1 retry on failure
- **Browsers**: Chrome (Desktop & Mobile), Safari (Mobile)

## 🎯 Test Scenarios

The application provides various scenarios for testing that you could automate:

- **Authentication**: Registration, login, logout
- **Articles**: Create, read, update, delete articles
- **Comments**: Add and remove comments
- **User Profiles**: View and edit user profiles
- **Social Features**: Follow users, favorite articles
- **Navigation**: Site navigation and routing

## 📚 Additional Resources

- [RealWorld Application Spec](https://github.com/gothinkster/realworld)
- [Application Details](./APPLICATION.md) - Information about the application stack

---

For detailed information about the application architecture and technology stack, see [APPLICATION.md](./APPLICATION.md).
