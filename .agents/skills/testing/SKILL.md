---
name: testing
description: Implementasi testing untuk aplikasi web. Gunakan saat diminta membuat unit test, integration test, E2E test, test setup, test coverage, atau debugging test yang gagal.
allowed-tools: Read Write Bash(npx *) Bash(npm *) Bash(pnpm *) Bash(pip *) Bash(python3 *) Bash(pytest *)
argument-hint: "unit | e2e | integration | setup | coverage  target: file atau feature"
---

# Web Testing Skill — Playwright + Vitest + pytest

## Tech Stack

- **Unit Test:** Vitest (frontend + backend unit)
- **E2E Test (UI):** Playwright (cross-browser, auto-wait)
- **API/E2E Test (backend):** Vitest + Supertest (NestJS endpoint testing)
- **Python Test:** pytest + httpx (FastAPI testing)
- **Coverage:** v8 (Vitest)
- **Mock:** MSW (frontend API mocking), Vitest mock (unit)

> Catatan: stack ini full-Vitest untuk Node (frontend & backend), tidak memakai Jest. Jangan tinggalkan artefak `jest-e2e.json`.

## Folder Structure

### Frontend Testing
```
frontend/
├── src/
│   ├── components/__tests__/   # Component unit tests
│   ├── hooks/__tests__/        # Hook tests
│   ├── services/__tests__/     # Service unit tests
│   └── stores/__tests__/       # Store tests
├── e2e/
│   ├── fixtures/               # Test fixtures & helpers
│   ├── pages/                  # Page Object Models
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   └── base.page.ts
│   ├── auth.spec.ts            # Auth E2E tests
│   └── global-setup.ts         # Auth state setup
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

### Backend Testing
```
backend/
├── src/modules/[feature]/__tests__/
│   ├── feature.service.spec.ts     # Unit test
│   └── feature.controller.spec.ts  # Controller test
├── test/
│   ├── app.e2e-spec.ts             # E2E (Vitest + Supertest)
│   └── setup-e2e.ts
├── vitest.config.ts                # unit
└── vitest.config.e2e.ts            # e2e
```

### AI Service Testing
```
ai-service/
├── tests/
│   ├── unit/
│   │   ├── test_chat_service.py
│   │   └── test_providers.py
│   ├── integration/
│   │   └── test_endpoints.py
│   ├── conftest.py
│   └── pytest.ini
```

## Implementation Rules

### Vitest Config (Frontend)

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/types/**", "src/test-setup.ts"],
      thresholds: { branches: 70, functions: 70, lines: 70, statements: 70 },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

### Component Unit Test (Vitest + React Testing Library)

```tsx
// components/__tests__/login-form.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "../login-form";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("LoginForm", () => {
  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument();
      expect(screen.getByText(/password wajib diisi/i)).toBeInTheDocument();
    });
  });
});
```

### TanStack Query Hook Test

```tsx
// hooks/__tests__/use-examples.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useExamples } from "../use-examples";
import { exampleService } from "@/services/example.service";
import { createWrapper } from "@/test-utils";

vi.mock("@/services/example.service");

describe("useExamples", () => {
  it("should fetch examples successfully", async () => {
    const mockData = [{ id: "1", name: "Test" }];
    vi.mocked(exampleService.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useExamples(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
```

### Playwright E2E Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Object Model (Playwright)

```typescript
// e2e/pages/base.page.ts
import { Page, Locator } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForLoad() {
    await this.page.waitForLoadState("networkidle");
  }
}

// e2e/pages/login.page.ts
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: /masuk/i });
    this.errorMessage = page.getByRole("alert");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Playwright E2E Test

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";

test.describe("Authentication", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate("/login");
  });

  test("should show validation errors for invalid input", async () => {
    await loginPage.submitButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await loginPage.login("admin@example.com", "password123");
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### NestJS Service Unit Test (Vitest)

```typescript
// modules/user/__tests__/user.service.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "../user.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { ConflictException } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;
  let prisma: {
    user: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    prisma = { user: { findUnique: vi.fn(), create: vi.fn() } };
    service = new UserService(prisma as unknown as PrismaService);
  });

  it("should throw ConflictException if email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "1", email: "test@test.com" });

    await expect(
      service.create({ name: "Test", email: "test@test.com", password: "pass1234" }),
    ).rejects.toThrow(ConflictException);
  });
});
```

### NestJS E2E Test (Vitest + Supertest)

```typescript
// vitest.config.e2e.ts
import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

export default defineConfig({
  test: {
    include: ["test/**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    testTimeout: 30_000,
  },
  plugins: [swc.vite()], // SWC untuk transform decorator NestJS
});
```

```typescript
// test/app.e2e-spec.ts
import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { AppModule } from "../src/app.module";

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/api/health (GET) → 200", () => {
    return request(app.getHttpServer()).get("/api/health").expect(200);
  });

  it("/api/auth/login (POST) invalid → 400", () => {
    return request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: "not-an-email" })
      .expect(400);
  });
});
```

### FastAPI Test (pytest + httpx)

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
```

```python
# tests/integration/test_endpoints.py
import pytest


@pytest.mark.asyncio
async def test_chat_invalid_provider(client):
    response = await client.post(
        "/api/v1/chat/",
        json={"message": "Hello", "provider": "invalid_provider"},
    )
    assert response.status_code == 400
```

## Commands

```bash
# Frontend
npx vitest                       # unit (watch)
npx vitest run --coverage        # unit once + coverage
npx playwright test              # E2E
npx playwright test --ui         # UI mode

# Backend
npx vitest run                                   # unit
npx vitest run --config vitest.config.e2e.ts     # e2e

# AI Service
pytest
pytest --cov=app --cov-report=html
```

## Larangan

- JANGAN test implementation detail — test behavior/output
- JANGAN tinggalkan artefak Jest (`jest-e2e.json`) di stack full-Vitest
- JANGAN skip error case — selalu test happy path + error path
- JANGAN hardcode test data — gunakan fixtures/factories
- JANGAN test yang depend ke external API langsung — mock provider
- JANGAN test framework internal — test KODE KAMU, bukan library
- JANGAN abaikan flaky test — fix atau skip dengan alasan jelas

## Task

$ARGUMENTS
