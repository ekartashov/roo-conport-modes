# Examples: Using 'Docs' Mode as a Documentation Auditor

This document provides practical examples of how to interact with the `📝 Docs` mode when your goal is to audit and improve existing documentation. These scenarios illustrate the collaborative workflow for enhancing document quality.

## Example 1: Reviewing a Tutorial for Clarity and Accuracy

**Scenario:** You have an existing tutorial, `docs/guides/feature-X-tutorial.md`, and you want to ensure it's clear for new users and technically accurate after recent feature updates.

**Your Initial Prompt:**
```
/mode docs
I'd like you to audit the tutorial at `docs/guides/feature-X-tutorial.md`.
Please focus on clarity for beginners and check for any outdated information based on our latest release (v2.5).
I can provide the content of the tutorial if you can't read it directly.
```

**(Assuming the mode can read the file, or you provide the content)**

**Mode's Potential Initial Findings & Questions:**
```
Okay, I've reviewed `docs/guides/feature-X-tutorial.md`. Here are some initial observations and questions:

*   **Clarity:** Section 2, "Advanced Configuration Options," uses terms like "idempotency key" and "sharding strategy" without prior explanation. For beginners, these might be confusing. Would you like me to suggest simpler explanations or link to a glossary?
*   **Outdated Info:** Step 3 mentions "Navigate to the 'Old Settings' page." Our v2.5 release notes indicate this page was renamed to "System Settings." Should this be updated?
*   **Completeness:** The tutorial doesn't cover the new "Batch Processing" sub-feature introduced in v2.5. Should a section on this be added?

I can provide more detailed suggestions for specific sentences or steps if you'd like.
```

**Your Response:**
```
Good points!
Yes, please suggest simpler explanations for "idempotency key" and "sharding strategy" in Section 2.
Update "Old Settings" to "System Settings" in Step 3.
Let's hold off on adding "Batch Processing" to this tutorial for now, we'll create a separate advanced guide for that.
```

**Mode's Suggested Revisions (Excerpt):**
```
Okay, here are the suggested changes:

**For Section 2 (Clarity):**

*Original:* "...configure the idempotency key for request deduplication and define your sharding strategy for data distribution."

*Suggested:* "...configure a unique request identifier (often called an 'idempotency key') to prevent accidental duplicate operations. You can also define how your data is distributed across different servers (your 'sharding strategy'), though this is an advanced topic you can revisit later."

**For Step 3 (Outdated Info):**

*Original:* "3. Navigate to the 'Old Settings' page by clicking the gear icon..."

*Suggested:* "3. Navigate to the 'System Settings' page by clicking the gear icon..."

Would you like me to apply these changes directly to the document, or would you prefer to do it? I can also continue reviewing other sections.
```

**Interaction Continues:** You would discuss the suggestions, approve changes, and guide the mode to review other aspects or documents.

## Example 2: Checking Style Guide Adherence and Link Integrity

**Scenario:** Your project has a `STYLE_GUIDE.md` and you want to ensure a newly contributed document, `docs/community/new-feature-proposal.md`, adheres to it and has no broken links.

**Your Initial Prompt:**
```
/mode docs
Please audit `docs/community/new-feature-proposal.md`.
Check it against our `STYLE_GUIDE.md` (I can provide its content).
Specifically, verify heading formats (we use sentence case) and code block styling.
Also, please check all external links in the proposal for validity.
```

**(You provide content for both files if needed)**

**Mode's Potential Findings:**
```
I've reviewed `docs/community/new-feature-proposal.md` against your `STYLE_GUIDE.md` and checked the links. Here's a summary:

*   **Style Guide Adherence:**
    *   **Headings:**
        *   Section "2. Core Architectural Changes" should be "2. Core architectural changes" (sentence case).
        *   Section "3. API Endpoints Definition" should be "3. API endpoints definition".
    *   **Code Blocks:** Most code blocks are fine. However, the Python example in section 4.1 is missing language specification (e.g., ```python). Your style guide recommends specifying the language.
*   **Link Integrity:**
    *   The link to `https://example-lib.com/docs/v1.2/specific-api` in section 2.2 appears to be broken (returns a 404 error).
    *   All other external links seem to be working.

I can provide the exact line numbers for these issues.
```

**Your Response:**
```
Thanks! Please go ahead and correct the heading capitalization and add `python` to that code block.
I'll manually update the broken link later, thanks for catching it.
```

**Mode's Action (if permitted to edit):**
```
Okay, I will apply the following changes:
- Update heading in section 2 to "Core architectural changes".
- Update heading in section 3 to "API endpoints definition".
- Add `python` specifier to the code block in section 4.1.

I'll let you know once these are done.
```
*(Or, if not editing directly, it would provide diffs or clear instructions for you to make the changes.)*

## Example 3: Auditing for Completeness and Consistency in API Documentation

**Scenario:** You have API documentation for several related microservices and want to ensure consistency in how endpoints are described and that no key information is missing.

**Your Initial Prompt:**
```
/mode docs
I need an audit of our API documentation for the 'UserService' and 'OrderService'.
(Provide paths or content for `docs/api/user-service.md` and `docs/api/order-service.md`)
Please check for:
1.  Consistency in describing request/response parameters (e.g., are data types always specified?).
2.  Completeness: Does each endpoint description include HTTP method, path, a brief description, parameters, and example responses (success & error)?
3.  Consistent use of terminology, cross-referencing our `ProjectGlossary.md` (provide content or path).
```

**Mode's Potential Findings (Excerpt):**
```
After reviewing the API documentation for `UserService` and `OrderService`, and cross-referencing `ProjectGlossary.md`:

*   **Consistency in Parameters:**
    *   In `user-service.md`, the `GET /users/{id}` endpoint lists `id` parameter type as `integer`.
    *   In `order-service.md`, the `GET /orders/{userId}` endpoint lists `userId` parameter type as `string (UUID)`. While both might be correct, ensure this difference is intentional and clearly understood. If `userId` in `OrderService` refers to the `id` from `UserService`, their types should ideally align or the difference explained.
    *   The `POST /users` in `user-service.md` is missing data type specifications for `email` and `password` in the request body description.
*   **Completeness:**
    *   `order-service.md`: The `DELETE /orders/{orderId}` endpoint is missing an example error response (e.g., for when an order is not found or cannot be deleted).
*   **Terminology:**
    *   `user-service.md` uses the term "User Identifier" while `order-service.md` uses "User ID". `ProjectGlossary.md` defines "User ID" as the standard term. Suggest standardizing to "User ID".

I can provide a more detailed list of specific locations for these points.
```

**Interaction Continues:** You would discuss these findings, confirm intended meanings (like the `id` vs `userId` types), and instruct the mode on how to proceed with corrections or further analysis.

These examples show how the `📝 Docs` mode can act as a diligent auditor, helping you systematically improve your documentation by focusing on various quality aspects.