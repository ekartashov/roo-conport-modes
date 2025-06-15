# Documentation Auditor Guide (Using the 'Docs' Mode)

## Overview

This guide explains how to use the `📝 Docs` mode for auditing, reviewing, and improving existing technical documentation. While the `docs` mode is versatile, this guide focuses specifically on its capabilities as a "Documentation Auditor," helping you enhance the quality and effectiveness of your current documents.

The `📝 Docs` mode, when used for auditing, assists in:
-   Ensuring clarity, conciseness, accuracy, and maintainability.
-   Checking for adherence to documentation principles and project-specific style guides.
-   Identifying gaps, inconsistencies, or outdated information.
-   Validating links and references.
-   Improving overall structure and readability.

### Quick Start

```bash
# Ensure you are in the 'Docs' mode
/mode docs

# Request to audit a document
"Please review this README.md for clarity, completeness, and any potential issues."
(You would then provide the content of README.md or its path)

# Or, more specifically:
"Audit docs/guides/user-setup-guide.md. Focus on style guide adherence (our guide is in ConPort under ProjectStyleGuides/main-style-guide) and check for broken links."
```

## Core Principles for Auditing Documentation

When using the `📝 Docs` mode for auditing, it leverages its understanding of documentation best practices (P01-P10 from its `customInstructions`) and specific audit-focused capabilities:

1.  **Audience Alignment (P01):** Is the document still appropriate for its intended audience?
2.  **Clarity and Conciseness (P05):** Is the language clear? Is there jargon that needs explanation? Can any sections be more concise?
3.  **Completeness and Accuracy (P06):** Is the information complete and up-to-date? Are there any factual errors or omissions?
4.  **Consistency and Style (P08):** Is the tone, terminology, and formatting consistent throughout the document and with other project documentation? Does it adhere to any specified project style guides (potentially stored in ConPort)?
5.  **Logical Structure (P03):** Is the document well-organized and easy to navigate?
6.  **Effective Examples & Visuals (P07):** Are examples clear, correct, and helpful? Are visuals still relevant?
7.  **Link Integrity:** Are all internal and external links working and pointing to the correct resources?
8.  **Action-Oriented Onboarding (P02):** For guides, do they effectively onboard users?
9.  **Progressive Disclosure (P04):** Is information presented in a layered manner, avoiding overwhelming the reader?
10. **Maintainability (P09):** Are there aspects that make the document hard to maintain?

## Workflow for Auditing Documentation

The `📝 Docs` mode can follow this general workflow when auditing documents:

1.  **Goal & Scope Definition:**
    *   **You:** Clearly state which document(s) to audit and what specific areas of focus are most important (e.g., "check for outdated information," "ensure style guide compliance," "improve clarity for beginners").
        *   *Example: "Audit our API documentation for consistency in endpoint descriptions and verify all example request/response payloads."*
    *   **Mode:** May ask clarifying questions about the target audience (if not obvious), any specific style guides to use, or known problem areas.

2.  **Source Material & Context Gathering:**
    *   **You:** Provide the document(s) to be audited. If a specific style guide or set of conventions applies, provide access to it (e.g., by pointing to a ConPort entry like `custom_data` category `ProjectStyleGuides`, or providing the guide directly).
    *   **Mode:** Reads the provided document(s). It can also leverage ConPort for relevant context (e.g., `ProjectGlossary` for term consistency, `system_patterns` for technical accuracy).

3.  **Analysis & Issue Identification:**
    *   **Mode:** Systematically reviews the document based on your defined scope and general documentation principles. It will look for:
        *   Violations of style guides (formatting, tone, terminology).
        *   Broken or outdated links.
        *   Inaccurate or outdated technical information.
        *   Areas lacking clarity or conciseness.
        *   Incomplete sections or missing information.
        *   Structural issues or poor navigation.
        *   Inconsistencies within the document or with other related documents.
    *   The mode's "Documentation Auditor" enhancement helps it distinguish specific audit requests from general documentation help and focuses its learning on style guide adherence, link integrity, content accuracy, clarity, conciseness, and completeness checks.

4.  **Reporting & Suggestion Generation:**
    *   **Mode:** Provides a report of its findings, categorizing issues and suggesting specific improvements. Suggestions might include:
        *   Rewording sentences for clarity.
        *   Correcting factual errors.
        *   Updating outdated links or information.
        *   Reformatting sections for consistency.
        *   Adding missing explanations or examples.
        *   *Example: "In section 3.2, the term 'flux capacitor' is used without prior definition. Suggest adding it to the glossary or defining it inline. The link to 'external-dependency.com/docs' in section 4.1 appears to be broken."*

5.  **Iterative Refinement & Application of Changes:**
    *   **You:** Review the mode's suggestions.
    *   **Mode:** Can help apply the suggested changes directly to the document if you approve, or you can apply them manually. You can discuss specific suggestions and ask for alternative phrasings or approaches.

## Specific Audit Tasks

### Style Guide Adherence

*   **You:** "Please check if this document ([`path/to/doc.md`](path/to/doc.md:0)) adheres to our company's technical writing style guide (available in ConPort: `ProjectStyleGuides/TechWritingV2`). Pay attention to heading capitalization and list formatting."
*   **Mode:** Reviews the document against the specified style guide and flags deviations.

### Link Integrity Check

*   **You:** "Can you scan [`docs/main-guide.md`](docs/main-guide.md:0) for any broken internal or external links?"
*   **Mode:** Attempts to identify links and may (depending on its capabilities and tool access) try to verify them or flag them for manual checking.

### Content Accuracy & Up-to-dateness

*   **You:** "This installation guide ([`docs/install.md`](docs/install.md:0)) was written 6 months ago. Can you review it for any steps or version numbers that might be outdated, comparing it against the latest release notes (provide release notes or point to them)?"
*   **Mode:** Compares the document against newer information to identify discrepancies.

### Clarity & Conciseness Review

*   **You:** "The 'Advanced Configuration' section of [`config-guide.md`](config-guide.md:0) seems a bit dense. Can you review it for clarity and suggest ways to make it more understandable for users who are not deep experts?"
*   **Mode:** Analyzes the text for complex sentences, jargon, and areas that could be simplified or better explained.

### Completeness Check

*   **You:** "Does this API reference for the `/users` endpoint cover all standard CRUD operations (Create, Read, Update, Delete)? Here's the current doc: (provide content)."
*   **Mode:** Reviews the provided documentation against the expected scope to identify missing elements.

## Tips for Effective Document Auditing with `📝 Docs` Mode

*   **Be Specific About Scope:** Clearly define what you want the mode to audit and what criteria to use.
*   **Provide Context:** Share relevant style guides, glossaries, or related documents.
*   **Prioritize Issues:** If the mode finds many issues, ask it to help prioritize them based on impact.
*   **Iterate on Suggestions:** Discuss the mode's findings and work collaboratively to find the best solutions.
*   **Use for Continuous Improvement:** Regularly audit key documents to maintain their quality over time.

By leveraging the `📝 Docs` mode as a Documentation Auditor, you can significantly improve the quality, consistency, and effectiveness of your project's documentation.