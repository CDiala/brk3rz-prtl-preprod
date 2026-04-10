# Nx Angular Repository

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ A repository showcasing key [Nx](https://nx.dev) features for Angular monorepos ✨
🚀 If you haven't connected to Nx Cloud yet, [complete your setup here](https://cloud.nx.app/setup/connect-workspace/guide). Get faster builds with remote caching, distributed task execution, and self-healing CI. [See how your workspace can benefit](#nx-cloud).

## 📦 Project Overview

This repository demonstrates a production-ready Angular monorepo with:

- **2 Applications**
  - `shop` - Angular e-commerce application with product listings and detail views
  - `api` - Backend API with Docker support serving product data

- **6 Libraries**
  - `@org/feature-products` - Product listing feature (Angular)
  - `@org/feature-product-detail` - Product detail feature (Angular)
  - `@org/data` - Data access layer for shop features
  - `@org/shared-ui` - Shared UI components
  - `@org/models` - Shared data models
  - `@org/products` - API product service library

- **E2E Testing**
  - `shop-e2e` - Playwright tests for the shop application

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-fork-url>
cd <your-repository-name>

# Install dependencies
# (Note: You may need --legacy-peer-deps)
npm install

# Serve the Angular shop application (this will simultaneously serve the API backend)
npx nx serve shop

# ...or you can serve the API separately
npx nx serve api

# Build all projects
npx nx run-many -t build

# Run tests
npx nx run-many -t test

# Lint all projects
npx nx run-many -t lint

# Run e2e tests
npx nx e2e shop-e2e

# Run tasks in parallel

npx nx run-many -t lint test build e2e --parallel=3

# Visualize the project graph
npx nx graph
```

## ⭐ Featured Nx Capabilities

This repository showcases several powerful Nx features:

### 1. 🔒 Module Boundaries

Enforces architectural constraints using tags. Each project has specific dependencies it can use:

- `scope:shared` - Can be used by all projects
- `scope:shop` - Shop-specific libraries
- `scope:api` - API-specific libraries
- `type:feature` - Feature libraries
- `type:data` - Data access libraries
- `type:ui` - UI component libraries

**Try it out:**

```bash
# See the current project graph and boundaries
npx nx graph

# View a specific project's details
npx nx show project shop --web
```

[Learn more about module boundaries →](https://nx.dev/features/enforce-module-boundaries)

### 2. 🐳 Docker Integration

The API project includes Docker support with automated targets and release management:

```bash
# Build Docker image
npx nx docker:build api

# Run Docker container
npx nx docker:run api

# Release with automatic Docker image versioning
npx nx release
```

**Nx Release for Docker:** The repository is configured to use Nx Release for managing Docker image versioning and publishing. When running `nx release`, Docker images for the API project are automatically versioned and published based on the release configuration in `nx.json`. This integrates seamlessly with semantic versioning and changelog generation.

[Learn more about Docker integration →](https://nx.dev/recipes/nx-release/release-docker-images)

### 3. 🎭 Playwright E2E Testing

End-to-end testing with Playwright is pre-configured:

```bash
# Run e2e tests
npx nx e2e shop-e2e

# Run e2e tests in CI mode
npx nx e2e-ci shop-e2e
```

[Learn more about E2E testing →](https://nx.dev/technologies/test-tools/playwright/introduction#e2e-testing)

### 4. ⚡ Vitest for Unit Testing

Fast unit testing with Vite for Angular libraries:

```bash
# Test a specific library
npx nx test data

# Test all projects
npx nx run-many -t test
```

[Learn more about Vite testing →](https://nx.dev/recipes/vite)

### 5. 🔧 Self-Healing CI

The CI pipeline includes `nx fix-ci` which automatically identifies and suggests fixes for common issues:

```bash
# In CI, this command provides automated fixes
npx nx fix-ci
```

This feature helps maintain a healthy CI pipeline by automatically detecting and suggesting solutions for:

- Missing dependencies
- Incorrect task configurations
- Cache invalidation issues
- Common build failures

[Learn more about self-healing CI →](https://nx.dev/ci/features/self-healing-ci)

## 📁 Project Structure

```
├── apps/
│   ├── shop/           [scope:shop]    - Angular e-commerce app
│   ├── shop-e2e/                       - E2E tests for shop
│   └── api/            [scope:api]     - Backend API with Docker
├── libs/
│   ├── shop/
│   │   ├── feature-products/        [scope:shop,type:feature] - Product listing
│   │   ├── feature-product-detail/  [scope:shop,type:feature] - Product details
│   │   ├── data/                    [scope:shop,type:data]    - Data access
│   │   └── shared-ui/               [scope:shop,type:ui]      - UI components
│   ├── api/
│   │   └── products/    [scope:api]    - Product service
│   └── shared/
│       └── models/      [scope:shared,type:data] - Shared models
├── nx.json             - Nx configuration
├── tsconfig.json       - TypeScript configuration
└── eslint.config.mjs   - ESLint with module boundary rules
```

## 🏷️ Understanding Tags

This repository uses tags to enforce module boundaries:

| Project            | Tags                         | Can Import From              |
| ------------------ | ---------------------------- | ---------------------------- |
| `shop`             | `scope:shop`                 | `scope:shop`, `scope:shared` |
| `api`              | `scope:api`                  | `scope:api`, `scope:shared`  |
| `feature-products` | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `data`             | `scope:shop`, `type:data`    | `scope:shared`               |
| `models`           | `scope:shared`, `type:data`  | Nothing (base library)       |

## 📚 Useful Commands

```bash
# Project exploration
npx nx graph                                    # Interactive dependency graph
npx nx list                                     # List installed plugins
npx nx show project shop --web                 # View project details

# Development
npx nx serve shop                              # Serve Angular app
npx nx serve api                               # Serve backend API
npx nx build shop                              # Build Angular app
npx nx test data                               # Test a specific library
npx nx lint feature-products                   # Lint a specific library

# Running multiple tasks
npx nx run-many -t build                       # Build all projects
npx nx run-many -t test --parallel=3          # Test in parallel
npx nx run-many -t lint test build            # Run multiple targets

# Affected commands (great for CI)
npx nx affected -t build                       # Build only affected projects
npx nx affected -t test                        # Test only affected projects

# Docker operations
npx nx docker:build api                        # Build Docker image
npx nx docker:run api                          # Run Docker container
```

## 🎯 Adding New Features

### Generate a new Angular application:

```bash
npx nx g @nx/angular:app my-app
```

### Generate a new Angular library:

```bash
npx nx g @nx/angular:lib my-lib
```

- prefered script

```bash
pnpm exec nx generate @nx/angular:library --directory=libs/auth/ --name=auth --parent=apps/web/src/app/app.routes.ts --routing=true --importPath=@insurFlow/auth --no-interactive --dry-run
```

### Generate a new Angular component:

```bash
npx nx g @nx/angular:component my-component --project=my-lib
```

### Generate a new API library:

```bash
npx nx g @nx/node:lib my-api-lib
```

You can use `npx nx list` to see all available plugins and `npx nx list <plugin-name>` to see all generators for a specific plugin.

## Nx Cloud

Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## 🔗 Learn More

- [Nx Documentation](https://nx.dev)
- [Angular Monorepo Tutorial](https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial)
- [Module Boundaries](https://nx.dev/features/enforce-module-boundaries)
- [Docker Integration](https://nx.dev/recipes/nx-release/release-docker-images)
- [Playwright Testing](https://nx.dev/technologies/test-tools/playwright/introduction#e2e-testing)
- [Vite with Angular](https://nx.dev/recipes/vite)
- [Nx Cloud](https://nx.dev/ci/intro/why-nx-cloud)
- [Releasing Packages](https://nx.dev/features/manage-releases)

## 💬 Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [X (Twitter)](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)

# NgRx Setup in Nx Workspace (80/20 Rule)

To install and set up NgRx in an Nx workspace using the 80/20 rule, you should initialize a minimal global state in your application and delegate all specific feature logic to libraries.
This guide outlines how to implement NgRx following the Nx architectural pattern: keeping the application shell lean (20%) and moving feature logic into libraries (80%).

## 1. Install NgRx Packages

Add the core dependencies to your workspace root:

```bash
pnpm add @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/router-store --save
```

## 2. Root State Initialization (The 20%)

Initialize the global store in your main application with a minimal configuration. This sets up the provider logic without bloating the app with feature code.

**Command:**

```bash
nx g @nx/angular:ngrx-root-store --name=global --addDevTools=true --facade=true --skip-import=true
```

- What app would you like to generate a NgRx configuration for? · web

_Replace `global` with your actual store name._

## 3. Feature State Generation (The 80%)

Generate specific state management inside your functional libraries. This ensures business logic is modular and can be lazy-loaded.

**Command:**

```bash
npx nx generate @nx/angular:ngrx-feature-store
```

- ✔ What name would you like to use for the NgRx feature state? An example would be `users`. · auth
- ✔ What is the path to the module or Routes definition where this NgRx state should be registered? · libs/auth/src/lib/lib.routes.ts
- ✔ Would you like to use a Facade with your NgRx state? (y/N) · true

## 4. Folder Structure within Libraries

Nx will create a `+state` folder inside your library with the following architecture:

- **actions.ts**: Defines unique events (e.g., `[Products] Load Items`).
- **reducer.ts**: Pure functions that handle state transitions.
- **selectors.ts**: Optimized functions to query data from the store.
- **effects.ts**: Handles side-effects like API calls or navigation.

---

_Note: Always ensure your libraries are exported via `index.ts` so they can be consumed by the application._

### Install Angular material

- Run the command:

```bash
pnpm add @angular/material
```

**NB: if you've added nx host to your project, enter your `apps/my-app/project.json` under `targets -> build -> executor` and change `"@nx/angular:webpack-browser"` to `"@angular-devkit/build-angular:browser"` before running the step below. After running the step below, go and roll back this change in the json file**

- Run the code below and follow the steps.

```bash
nx g @angular/material:ng-add --project=web
```

- Re-serve project using `pnpm run dev`
- Test using any angular material component
