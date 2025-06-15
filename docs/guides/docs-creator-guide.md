# Documentation Creator Guide (Using the 'Docs' Mode)

## Overview

This guide explains how to use the `📝 Docs` mode for creating new technical documentation. While the `docs` mode is versatile, this guide focuses specifically on its capabilities as a "Documentation Creator," helping you draft various types of documents from scratch.

The `📝 Docs` mode assists in:
-   Creating clear, concise, and comprehensive technical documentation.
-   Structuring complex information for various audiences.
-   Writing user guides, API references, tutorials, conceptual overviews, architectural documents, how-to guides, READMEs, and more.

### Quick Start

```bash
# Ensure you are in the 'Docs' mode
/mode docs

# Request to create a new document
"I need to create a user guide for the new reporting feature."

# Or, more specifically:
"Help me draft a README for the 'alpha-component' library, targeting new contributors."
```

## Core Principles for Creating Documentation

When using the `📝 Docs` mode for content creation, keep these principles (derived from its `customInstructions`) in mind:

1.  **Audience First (P01):** Always define your target audience. The mode will help tailor content, style, and depth accordingly.
2.  **Action-Oriented Onboarding (P02):** For guides and tutorials, focus on getting the user started quickly with clear, actionable steps.
3.  **Logical Structure (P03):** Plan a hierarchical and scannable structure. The mode can help suggest standard outlines.
4.  **Progressive Disclosure (P04):** Start with concise primary information and link to more detailed explanations where necessary.
5.  **Clarity and Conciseness (P05):** Aim for clear language and explain any jargon. The mode can assist in simplifying complex topics.
6.  **Completeness and Accuracy (P06):** Strive for thorough and correct information.
7.  **Effective Examples & Visuals (P07):** Incorporate copy-pasteable code examples and helpful visuals where appropriate. The mode can help generate or suggest these.
8.  **Consistent Tone & Style (P08):** Maintain a consistent voice. If a project style guide exists (check ConPort), the mode will adhere to it.
9.  **Maintainability (P09):** Think about how the document will be updated in the future.
10. **Call to Action & Further Learning (P10):** Guide users to next steps or related resources.

## Workflow for Creating New Documentation

The `📝 Docs` mode follows a structured workflow when creating new documents:

1.  **Goal & Audience Definition:**
    *   **You:** Clearly state the purpose of the new document and who it's for.
        *   *Example: "I want to create a tutorial for beginners on how to set up the development environment for Project X."*
    *   **Mode:** Asks clarifying questions to refine understanding of the audience and goals.

2.  **Source Material & Context Gathering:**
    *   **You:** Provide any relevant source material (e.g., feature specifications, existing code, design documents).
    *   **Mode:** Can proactively search ConPort (if relevant information is logged there like `system_patterns`, `decisions`, or `ProjectGlossary` terms) or analyze provided code to gather context.

3.  **Outline & Structure Proposal:**
    *   **Mode:** Suggests a logical outline and structure based on the document type (e.g., README, tutorial, API reference) and your defined goals/audience. It might leverage standard structures like Diátaxis or common templates.
        *   *Example: "For a beginner tutorial, I suggest this structure: 1. Introduction (Goal, Prerequisites), 2. Step-by-step Setup, 3. Verification, 4. Troubleshooting, 5. Next Steps."*
    *   **You:** Review and refine the proposed outline with the mode.

4.  **Content Drafting & Iteration:**
    *   **Mode:** Assists in drafting content section by section, focusing on clarity, conciseness, and adherence to documentation principles. It can help explain complex topics, simplify jargon, and improve style.
    *   **You:** Provide key information, review drafted content, and offer feedback for iterative refinement.
        *   *Example: "For the 'Prerequisites' section, please list Node.js v18+ and Git."*
        *   *Mode drafts section*
        *   *You: "That looks good, but can you also add a link to the official Node.js installation guide?"*

5.  **Review & Verification:**
    *   **You & Mode:** Collaboratively review the drafted content for clarity, accuracy, completeness, and consistency.
    *   **Mode:** Can help identify areas that need more detail or examples. If applicable, it can help verify instructions or code snippets.

6.  **ConPort Logging & Linking (Optional but Recommended):**
    *   **Mode:** As the documentation nears completion, it may identify new decisions, patterns, or glossary terms that emerged during the creation process. It can offer to log these into ConPort.
    *   **You:** Confirm if these items should be logged to enrich the project's knowledge base.

## Specific Document Types

### Creating READMEs

*   **Key Sections:** Project title, overview, installation, usage, contributing, license.
*   **Mode Assistance:** Can generate a standard README skeleton, help articulate the project's purpose, and structure installation/usage instructions clearly.

### Creating User Guides / Tutorials

*   **Focus:** Action-oriented, step-by-step instructions.
*   **Mode Assistance:** Helps break down complex processes into manageable steps, suggests clear headings, and can draft introductory and concluding remarks. Emphasizes the "why" behind steps.

### Creating Conceptual Overviews

*   **Focus:** Explaining high-level concepts, architecture, or how different parts of a system interact.
*   **Mode Assistance:** Can help structure complex information logically, define key terms (and suggest adding them to a ConPort `ProjectGlossary`), and use analogies or simpler explanations for difficult concepts.

### Creating API References

*   **Focus:** Detailing endpoints, request/response formats, authentication methods.
*   **Mode Assistance:** If provided with code or API specifications (e.g., OpenAPI), it can help parse this information to structure the reference document. It can also help ensure consistency in describing each endpoint.

## Tips for Effective Document Creation with `📝 Docs` Mode

*   **Be Specific:** The more detail you provide about your goals, audience, and desired content, the better the mode can assist you.
*   **Iterate:** Don't expect the first draft to be perfect. Work with the mode through several iterations of feedback and refinement.
*   **Leverage ConPort:** If your project uses ConPort, encourage the mode to reference existing `decisions`, `system_patterns`, or `ProjectGlossary` terms to ensure consistency and build upon existing knowledge.
*   **Provide Source Material:** If you have existing notes, code, or specifications, share them with the mode.
*   **Ask for Suggestions:** If you're unsure about structure or content, ask the mode for recommendations.

By following this guide and collaborating effectively with the `📝 Docs` mode, you can efficiently create high-quality technical documentation for your projects.