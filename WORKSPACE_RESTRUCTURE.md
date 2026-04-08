# Workspace Restructure - Insurance Landing Page Setup

## Overview

This document details the complete restructuring of the insurFlow Nx monorepo workspace. All template applications and libraries were removed, and a new host Angular application named `web` was created to serve as the landing page for the insurance application.

## Initial Workspace State

Before restructuring, the workspace contained:

### Applications (`apps/`)
- `shop` - Template Angular SSR frontend application
- `api` - Template Express.js backend application  
- `shop-e2e` - Template E2E tests for shop app

### Libraries (`libs/`)
- `libs/api/products` - Template product service library
- `libs/shared/models` - Template domain models library
- `libs/shop/data` - Template data service library
- `libs/shop/feature-product-detail` - Template feature module
- `libs/shop/feature-products` - Template feature module
- `libs/shop/shared-ui` - Template UI component library

## Restructure Strategy

The restructuring followed this approach:
1. Generate a new Angular application named `web` with SSR enabled
2. Remove template applications in dependency order (to avoid conflicts)
3. Remove template libraries in dependency order
4. Update root configuration files
5. Verify the workspace builds successfully

## Commands Executed

### 1. Generate New Web Application

Generated a clean Angular app with Server-Side Rendering enabled:

```bash
pnpm exec nx generate @nx/angular:application \
  --directory=apps/web \
  --name=web \
  --ssr \
  --e2eTestRunner=playwright \
  --unitTestRunner=vitest-angular \
  --tags=scope:web \
  --no-interactive
```

**Output:**
- Created `apps/web/` - Main application
- Created `apps/web-e2e/` - Playwright E2E tests
- Updated `nx.json` with new project configuration
- Updated `.gitignore`

### 2. Remove E2E Tests (Dependency: shop-e2e → shop)

Removed the template E2E test project first as it was dependent on the old shop app:

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=shop-e2e \
  --no-interactive
```

**Deleted:**
- `apps/shop-e2e/eslint.config.mjs`
- `apps/shop-e2e/playwright.config.ts`
- `apps/shop-e2e/project.json`
- `apps/shop-e2e/src/` (all test files)
- `apps/shop-e2e/tsconfig.json`

### 3. Remove Shop Application

Removed the template frontend application:

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=shop \
  --no-interactive
```

**Deleted:**
- `apps/shop/eslint.config.mjs`
- `apps/shop/project.json`
- `apps/shop/proxy.conf.json`
- `apps/shop/public/` (public assets)
- `apps/shop/src/` (all source files including app, main.ts, main.server.ts, server.ts, styles.css, etc.)
- `apps/shop/tsconfig*.json` (all TypeScript configurations)
- `apps/shop/vite.config.mts`

### 4. Remove API Application

Removed the template backend application:

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=api \
  --no-interactive
```

**Deleted:**
- `apps/api/Dockerfile`
- `apps/api/eslint.config.mjs`
- `apps/api/project.json`
- `apps/api/src/` (all source and assets)
- `apps/api/tsconfig*.json`
- `apps/api/vite.config.ts`

### 5. Remove API Products Library

Removed the template products service library:

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=products \
  --no-interactive
```

**Deleted:**
- `libs/api/products/` (entire directory)
- All associated TypeScript configs and test files
- Automatically deleted `libs/api/` parent directory (now empty)
- Updated `tsconfig.base.json` path mappings

### 6. Remove Feature Libraries (Dependency Chain)

Removed feature libraries in order due to dependency chain (feature libs → shared models/data):

#### 6a. Remove Feature Product Detail

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=feature-product-detail \
  --no-interactive
```

#### 6b. Remove Feature Products

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=feature-products \
  --no-interactive
```

### 7. Remove Remaining Libraries

Removed data, UI, and models libraries (in this order due to dependencies):

#### 7a. Remove Data Library

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=data \
  --no-interactive
```

#### 7b. Remove Shared UI Library

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=shared-ui \
  --no-interactive
```

**Deleted:**
- `libs/shop/shared-ui/` (entire directory with all UI components)
- Automatically deleted `libs/shop/` parent directory (now empty)

#### 7c. Remove Models Library

```bash
pnpm exec nx generate @nx/workspace:remove \
  --projectName=models \
  --no-interactive
```

**Deleted:**
- `libs/shared/models/` (entire directory)
- Automatically deleted `libs/shared/` parent directory (now empty)
- Automatically deleted `libs/` parent directory (now completely empty)
- Updated `tsconfig.base.json` path mappings

### 8. Update Root Configuration

Updated `package.json` dev script to point to the new web app:

**Before:**
```json
"scripts": {
  "dev": "npx nx run shop:serve"
}
```

**After:**
```json
"scripts": {
  "dev": "pnpm exec nx run web:serve"
}
```

## Final Workspace Structure

After restructuring, the workspace now contains only:

```
insurFlow/
├── apps/
│   ├── web/                          # New host Angular app with SSR
│   │   ├── src/
│   │   │   ├── app/                 # Application components
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.config.server.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   ├── app.routes.server.ts
│   │   │   │   ├── app.ts
│   │   │   │   ├── app.css
│   │   │   │   ├── app.html
│   │   │   │   └── app.spec.ts
│   │   │   ├── main.ts              # Browser entry point
│   │   │   ├── main.server.ts       # Server entry point
│   │   │   ├── server.ts            # Express server configuration
│   │   │   ├── index.html
│   │   │   └── styles.css
│   │   ├── public/                  # Static assets
│   │   ├── project.json             # Nx project configuration
│   │   ├── tsconfig*.json           # TypeScript configurations
│   │   ├── vite.config.ts           # Vite build configuration
│   │   └── eslint.config.mjs        # ESLint configuration
│   │
│   └── web-e2e/                     # Playwright E2E tests
│       ├── src/
│       │   └── example.spec.ts
│       ├── playwright.config.ts
│       ├── project.json
│       ├── tsconfig.json
│       └── eslint.config.mjs
│
├── nx.json                          # Nx workspace configuration (updated)
├── tsconfig.base.json               # Base TypeScript config (path mappings cleared)
├── package.json                     # Root package.json (dev script updated)
├── pnpm-lock.yaml                   # Package lock file
├── vite.workspace.ts
├── eslint.config.mjs
└── README.md
```

## Verification

### Build Test

Successfully built the web app in development mode:

```bash
pnpm exec nx run web:build --configuration=development
```

**Results:**
- Browser bundles: main.js (1.49 MB)
- Server bundles: main.server.mjs, server.mjs, polyfills.server.mjs
- Build completed successfully in 9.375 seconds
- Output location: `dist/apps/web/`

### Project Verification

Confirmed only the new projects exist:

```bash
pnpm exec nx show projects
```

**Output:**
```
web-e2e
web
```

## Web App Features

The new `web` application is configured with:

- **Framework**: Angular 21.2.5 with standalone components
- **SSR**: Server-Side Rendering enabled for SEO optimization
- **Build Tool**: Vite with esbuild
- **Testing**: 
  - Unit tests with Vitest (via @analogjs/vitest-angular)
  - E2E tests with Playwright
- **Linting**: ESLint configured
- **Server**: Express.js configured for SSR in `src/server.ts`

## Available Commands

### Development

```bash
# Start development server with SSR
pnpm dev
# or
pnpm exec nx run web:serve
```

### Building

```bash
# Development build
pnpm exec nx run web:build --configuration=development

# Production build
pnpm exec nx run web:build --configuration=production
```

### Testing

```bash
# Unit tests
pnpm exec nx run web:test

# E2E tests
pnpm exec nx run web-e2e:e2e
```

### Linting

```bash
# Lint the web app
pnpm exec nx run web:lint
```

## Next Steps for Development

1. **Customize Landing Page**: Modify `apps/web/src/app/app.ts` and `app.html` to create your insurance landing page
2. **Create Feature Libraries**: As the application grows, create feature-specific libraries:
   ```bash
   pnpm exec nx generate @nx/angular:library \
     --directory=libs/features/quote-form \
     --name=quote-form \
     --tags=scope:web,type:feature
   ```
3. **Add Shared UI Components**: Create a shared UI library for reusable components:
   ```bash
   pnpm exec nx generate @nx/angular:library \
     --directory=libs/shared/ui \
     --name=ui \
     --tags=scope:shared,type:ui
   ```
4. **Setup Styling**: Configure Tailwind CSS or your preferred styling framework
5. **Add Forms & Validation**: Integrate Angular Forms and validation libraries

## Key Files Modified

- **package.json**: Updated `dev` script to point to `web:serve`
- **nx.json**: Updated with new project configuration
- **.gitignore**: Updated with new build output paths
- **tsconfig.base.json**: Cleared path mappings (no libs now)

## Project Naming Convention

- **Apps**: `scope:web` tag for web application
- **Future Libraries**: `scope:` tag indicates domain (e.g., `scope:shared`, `scope:features`)
- **Future Libraries**: `type:` tag indicates library type (e.g., `type:feature`, `type:ui`, `type:data`)

## Dependency Management

The Nx workspace automatically manages dependencies through:
- `package.json` - NPM/pnpm dependencies
- `tsconfig.base.json` - TypeScript path mappings (updated as libs are added/removed)
- `nx.json` - Workspace configuration and task defaults
- `project.json` files - Individual project configurations

When creating new libraries, Nx automatically updates these configuration files.
