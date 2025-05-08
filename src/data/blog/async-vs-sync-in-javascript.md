---
pubDatetime: 2025-05-08
title: "Async vs Sync in JavaScript: What Every Web Developer Should Know"
slug: async-vs-sync-in-javascript
featured: false
ogImage: "../../assets/images/async-vs-sync-in-javascript.png"
tags:
  - javascript
draft: false
description: "As a JavaScript developer who started out in the Python 2 days (before async was a concern), I’ve always found the difference between synchronous and asynchronous functions a bit confusing. If you’re in the same boat, this post is for you!"
---

As a JavaScript developer who started out in the Python 2 days (before async was a concern), I’ve always found the difference between synchronous (`sync`) and asynchronous (`async`) functions a bit confusing. If you’re in the same boat, this post is for you!

## The Basics: Synchronous vs Asynchronous Functions

Synchronous functions run one line at a time, in order. Each line waits for the previous one to finish. If a function takes a long time (like a big calculation), everything else waits.

```javascript
function syncFunction() {
  console.log("Start");
  // Simulate a long task
  for (let i = 0; i < 1e9; i++) {}
  console.log("End");
}

syncFunction();
console.log("After syncFunction");
```

Output:

```text
Start
End
After syncFunction
```

Asynchronous functions can start a task and move on without waiting for it to finish. In JavaScript, this is done with callbacks, Promises, and `async`/`await`.

```javascript
function asyncFunction() {
  console.log("Start");
  setTimeout(() => {
    console.log("End");
  }, 1000);
}

asyncFunction();
console.log("After asyncFunction");
```

Output:

```text
Start
After asyncFunction
End
```

## Does `await` Block the Main Thread?

No. When you use await inside an `async` function, it only pauses that function until the Promise resolves. The rest of your code (including UI updates and event handlers) keeps running.

```javascript
async function demo() {
  console.log("Start");
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("End");
}

demo();
console.log("After demo");
```

Output:

```text
Start
After demo
End
```

So, `await` is a way to write asynchronous code that looks synchronous, but it does not block the main thread or freeze the UI.

## Why Aren’t All Functions `async`?

- Not all functions need to wait for `async` work. Many functions just do calculations or return values right away.
- `async` functions always return a Promise. This means you have to use `.then()` or `await` to get the result, even for simple things.
- Unnecessary complexity. Making everything async would force you to use await everywhere, making code harder to read.
- Performance. There’s a (tiny) overhead to creating Promises and managing `async` functions.

Best practice: Use `async` only when you need to `await` something inside the function. Keep functions synchronous when they don’t need to wait for anything.
