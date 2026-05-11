# Contributing

This repo is a **Next.js (App Router)** frontend that renders Optimizely CMS content via a “block registry” + `ContentAreaMapper`.

The fastest way to build UI here is to create a component (usually a “block”) and preview it **locally** via a dedicated preview route **without adding anything in the CMS**.

## Prerequisites

- Node.js (LTS recommended)
- npm

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js (usually `http://localhost:3000`).

## Developing a new block component

### 1) Create the block component

Blocks live under `components/block/` (currently as `*.tsx` files).

- Create a new component file: `components/block/<your-block>.tsx`
- Export the component as the **default** export

Example (current repo style):

```text
components/
  block/
    hero-block.tsx
```

### 2) (Optional) Register it for CMS rendering (later)

When the component is ready to be driven by CMS content, register it in the block registry:

- `components/content-area/block.tsx`

This registry maps CMS `__typename` values to dynamically imported React components. The key you add here must match the CMS Graph `__typename` that will be sent for that block.

> If you only need local preview, you can skip registration until the component is finalized.

## Previewing a new component locally (no CMS required)

This repo supports local preview routes under the site layout (so you still get the normal header/footer).

### 1) Create a preview page

Create a route under:

```text
app/(site)/[locale]/preview/<your-preview>/page.tsx
```

Examples:

```text
app/(site)/[locale]/preview/hero-block/page.tsx
app/(site)/[locale]/preview/pricing-card/page.tsx
```

### 2) Render your component with mock props

There are two supported preview patterns:

#### Option A (recommended): render the component directly

- Import your component
- Provide hard-coded mock props in the preview page

This is the simplest way to iterate on UI without CMS concerns.

#### Option B (production-like): render via `ContentAreaMapper`

If you want to preview the component the same way CMS pages render blocks:

- Import `ContentAreaMapper` from `components/content-area/mapper`
- Pass a mocked “block” object that includes `__typename`

This simulates the CMS payload shape locally while still requiring no CMS entry.

### 3) Open the preview URL

Because routes are locale-based, open:

- `http://localhost:3000/<locale>/preview/<your-preview>`

Examples:

- `http://localhost:3000/en/preview/hero-block`
- `http://localhost:3000/en/preview/pricing-card`

> Note: in the Next.js App Router, folders that start with `_` are treated as “private” (non-routable). That’s why we use `preview/` (no leading underscore) for preview routes.

## Formatting & linting

```bash
npm run lint
npm run format
```

## Notes

- Preview routes are intended for local development and UI review. If you need them excluded from production builds, guard them with an environment check (team decision).
- Draft-mode CMS previews use Optimizely + Next.js draft mode and are separate from these local preview routes.

# Contributing to Optimizely SaaS CMS + Next.js Masterclass

First off, thank you for considering contributing to our project! It's people like you that make this project such a great tool.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
   - [Issues](#issues)
   - [Pull Requests](#pull-requests)
3. [Setting Up the Development Environment](#setting-up-the-development-environment)
4. [Coding Standards](#coding-standards)
5. [Commit Message Guidelines](#commit-message-guidelines)
6. [Branching Model](#branching-model)
7. [Testing](#testing)
8. [Building and Deploying](#building-and-deploying)
9. [Managing Dependencies](#managing-dependencies)
10. [Reporting Bugs](#reporting-bugs)
11. [Suggesting Enhancements](#suggesting-enhancements)
12. [Project Maintainers](#project-maintainers)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [project_email@example.com](mailto:project_email@example.com).

## Getting Started

### Issues

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/szymonuryga/Optimizely-Masterclass/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/szymonuryga/Optimizely-Masterclass/issues/new). Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Setting Up the Development Environment

1. Clone the repository:

```bash
git clone https://github.com/szymonuryga/Optimizely-Masterclass.git
cd Optimizely-Masterclass
```

2. Install dependencies:

```shellscript
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the necessary variables (refer to the README for details).

4. Start the development server:

```shellscript
npm run dev
```

## Coding Standards

We use ESLint and Prettier to ensure consistent code style. Our configuration files (`.eslintrc.json` and `.prettierrc`) are included in the repository.

- Run ESLint:

```shellscript
npm run lint
```

- Run Prettier:

```shellscript
npm run format
```

Please ensure your code adheres to these standards before submitting a pull request.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

Example commit messages:

- `feat(visual-builder): add new layout component`
- `fix(api): handle error in revalidation endpoint`
- `docs(readme): update deployment instructions`

## Branching Model

We use a simplified Gitflow workflow:

- `main`: The main branch where the source code always reflects a production-ready state.
- `develop`: The branch where features are integrated for the next release.
- Feature branches: Named `feature/your-feature-name`, branched off from and merged back into `develop`.
- Hotfix branches: Named `hotfix/your-hotfix-name`, branched off from `main` and merged into both `main` and `develop`.

## Building and Deploying

To build the project:

```shellscript
npm run build
```

For deployment, we use Vercel. The `main` branch is automatically deployed to production, while feature branches are deployed to preview environments.

## Managing Dependencies

We use npm for managing dependencies. To add a new dependency:

```shellscript
npm install package-name
```

For dev dependencies:

```shellscript
npm install --save-dev package-name
```

Please update the `package.json` file accordingly and commit the changes.

## Reporting Bugs

When reporting bugs, please include:

1. A clear, descriptive title
2. A detailed description of the issue
3. Steps to reproduce the problem
4. Expected behavior
5. Actual behavior
6. Screenshots (if applicable)
7. Your environment (OS, browser, Node.js version, etc.)

## Suggesting Enhancements

When suggesting enhancements, please include:

1. A clear, descriptive title
2. A detailed description of the proposed enhancement
3. Any potential implementation ideas you have
4. Why this enhancement would be useful to most users

## Project Maintainers

- [Szymon Uryga](https://github.com/szymonuryga) - Lead Developer

Thank you for contributing to our project!
