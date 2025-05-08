---
pubDatetime: 2025-05-08
title: "Server Actions vs API Routes: Modern Data Mutations in Next.js & Remix"
slug: server-actions-vs-api-routes
featured: false
ogImage: "../../assets/images/server-actions.png"
tags:
  - javascript
draft: false
description: "I’ve recently been exploring Next.js and Remix. One of the most intriguing new patterns is Server Actions — a modern alternative to the traditional API route approach for handling data mutations. In this post, I’ll break down what Server Actions are, how they compare to API routes, their benefits and tradeoffs, and how to architect an app that needs both UI-driven and external API access."
---

As a web developer with experience in React, Flask, Django, FastAPI, and Express, I’ve recently been exploring Next.js and Remix. One of the most intriguing new patterns is **Server Actions** — a modern alternative to the traditional API route approach for handling data mutations.

In this post, I’ll break down what Server Actions are, how they compare to API routes, their benefits and tradeoffs, and how to architect an app that needs both UI-driven and external API access.

## What Are Server Actions?

**Server Actions** are a new paradigm in frameworks like Next.js (v13+) and Remix (v2+), allowing you to define server-side logic _directly_ alongside your UI components. Instead of creating a separate API route in another codebase and calling it from the client, you define a function (the "action") that runs on the server and invoke it from your components — often via form submission.

## Traditional API Routes (a.k.a. "The Old Way")

1. You write endpoints (e.g., `/api/user`) in your backend (Express, Flask, Django, etc.). This involves additional overhead of managing a seperate codebase / deployment for an API layer.
2. The frontend makes HTTP requests (fetch, axios, etc.) to these endpoints. This involves an additional layer of code in your frontend to handle HTTP requests. It also typically involves making the call using `useEffect` and managing the response in state.
3. The backend handles the request, processes data, and returns a response (usually JSON).

## Benefits of Server Actions

### 1. Colocation

Logic for data mutations lives right next to the component that uses it.  
**Benefit:** Easier to reason about, less context switching, and more maintainable code.

### 2. Type Safety (with TypeScript)

Since the action is a function, you get end-to-end type safety (no serialization/deserialization boundary).  
**Benefit:** Fewer bugs, better developer experience.

### 3. No Manual API Calls / Less Code

You invoke the backend function directly from your frontend code (e.g., via a form or a function call), not via `fetch`.  
**Benefit:** Less boilerplate, no need for a seperate API project, no need to manage URLs, headers, etc.

### 4. Automatic Server/Client Boundary

The framework ensures the function only runs on the server, even though you call it from the client.  
**Benefit:** Security and performance are easier to manage.

### 5. Built-in CSRF Protection

Frameworks often handle CSRF for you, especially with form submissions.  
**Benefit:** More secure by default.

## Tradeoffs and Limitations

### 1. Less Explicit Networking

The network boundary is abstracted away.  
**Tradeoff:** Can be less clear what's happening under the hood, especially for debugging or when you need fine-grained control.

### 2. Limited to Framework

Server Actions are tied to the framework’s conventions (Next.js, Remix, etc.).  
**Tradeoff:** Harder to share logic across different stacks or migrate away.

### 3. Testing and Tooling

Testing may require framework-specific tools/mocks.  
**Tradeoff:** Not as straightforward as testing a pure API endpoint.

### 4. Granular Control

You have full control over HTTP methods, headers, status codes, etc., with API routes.  
**Tradeoff:** Some of this is abstracted or requires extra work to customize with Server Actions.

### 5. Interoperability

API routes can be consumed by any client (mobile, third-party, etc.).  
**Tradeoff:** Server Actions are primarily for your own app’s frontend; not easily exposed to external clients.

## Can Users Invoke Server Actions Directly?

**No.**  
Server Actions are not exposed as public HTTP endpoints. They are invoked through framework-managed mechanisms (e.g., form submissions, special fetches) that are tightly coupled to your app’s frontend. The framework ensures that only requests originating from your app’s UI, with the correct context and credentials, can trigger these actions.

## Security Perspective

From a security perspective, **it is not possible for a user to directly trigger a Server Action as a public HTTP endpoint**. There is no stable, guessable, or documented HTTP endpoint for a Server Action. The invocation protocol is internal to the framework and not intended for external use.

- **CSRF Protection:** Server Actions are typically protected against cross-site request forgery by default.
- **Session/Authentication:** They run in the context of the current user session, so only authenticated users (if your app requires it) can trigger them. Note, you should still always verify your users within each server function (see CVE-2025-29927 to understand why).
- **No External Access:** You cannot `curl` or `POST` to a Server Action from outside the app without going through the UI and its security checks.

## A Useful Approach: Hybrid UI + API Access

If your app is primarily UI-driven but sometimes needs API access (for automation, integrations, or mobile clients), use both patterns:

1. **Use Server Actions for UI-Driven Logic**

   - For all user interactions that happen through your web UI, use Server Actions.

2. **Expose API Routes for External Access**

   - For endpoints that need to be accessed by scripts, third-party services, or mobile apps, define API routes.

3. **Share Business Logic**
   - Extract your core logic (e.g., database operations, validation) into shared modules.
   - Both Server Actions and API routes should call these shared functions.

**Example:**

Manage database logic in a single place, e.g. `/lib`

```ts
// lib/users.ts
export async function createUserInDb(data: any) {
  // ...insert into DB
}
```

Implement any business logic in the server action.

```ts
// app/users/page.tsx (Server Action)
import { createUserInDb } from "@/lib/users";

export async function createUser(formData: FormData) {
  const data = Object.fromEntries(formData);
  await createUserInDb(data);
  // ... other business logic
}
```

If you need an API route for a specific server action, just call the server action from a "thin" API handler.

```ts
// app/api/users/route.ts (API Route)
import { createUser } from "@/app/users/page"; // Import the server action

export async function POST(req: Request) {
  const data = await req.json();
  await createUser(data);
  return new Response("User created", { status: 201 });
}
```

## Conclusion

- Server Actions are a powerful, ergonomic way to handle UI-driven mutations in modern frameworks like Next.js and Remix.
- They are **not** public endpoints and cannot be triggered directly by external clients.
- For external API access, API routes remain the right tool.
- Share your business logic between both to avoid duplication and keep your app maintainable.
- If you’re building a modern web app, consider this hybrid approach for the best of both worlds!
