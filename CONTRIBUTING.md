# Contributing to Roo AI Modes Project

First off, thank you for considering contributing to the Roo AI Modes project! We welcome contributions from everyone. Whether it's reporting a bug, proposing a new feature, improving documentation, or writing code, your help is appreciated.

This document provides guidelines to help you contribute effectively.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md) (Note: `CODE_OF_CONDUCT.md` would need to be created separately if one is desired). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

There are many ways to contribute:

*   **Reporting Bugs:** If you find a bug, please open an issue.
*   **Suggesting Enhancements:** If you have an idea for a new feature or an improvement to an existing one, open an issue to discuss it.
*   **Writing Documentation:** Clear and comprehensive documentation is crucial. We always welcome improvements to our [docs](docs/).
*   **Submitting Pull Requests:** If you've fixed a bug or implemented a new feature, you can submit a pull request.

## Reporting Bugs

Before reporting a bug, please check the existing [issues](https://github.com/your-repo/issues) (replace with actual link if available) to see if someone has already reported it.

When reporting a bug, please include:

1.  **A clear and descriptive title.**
2.  **Steps to reproduce the bug.** Be as specific as possible.
3.  **What you expected to happen.**
4.  **What actually happened.** Include any error messages or logs.
5.  **Your environment:** Operating system, Roo version (if applicable), any relevant configuration.

## Suggesting Enhancements

Before suggesting an enhancement, please check the existing [issues](https://github.com/your-repo/issues) and [pull requests](https://github.com/your-repo/pulls) (replace links) to see if your idea is already being discussed or worked on.

When suggesting an enhancement, please include:

1.  **A clear and descriptive title.**
2.  **A detailed description of the proposed enhancement.** Explain the problem it solves or the value it adds.
3.  **Any potential alternatives or drawbacks.**
4.  **(Optional) Mockups or examples** if it involves UI changes or new syntax.

## Your First Code Contribution

Unsure where to begin contributing code? Look for issues tagged `good first issue` or `help wanted`.

If you're new to the project, here's a general workflow for code contributions:

1.  **Fork the repository.**
2.  **Clone your fork locally:** `git clone https://github.com/your-username/roo-ai-modes.git` (replace with actual fork URL)
3.  **Create a new branch for your changes:** `git checkout -b feature/your-feature-name` or `bugfix/issue-number`.
4.  **Make your changes.** Adhere to the project's coding style (if one is defined).
5.  **Test your changes thoroughly.** Add unit tests if applicable.
6.  **Commit your changes:** Write clear, concise commit messages.
    *   Example: `feat: Add support for YAML mode definitions`
    *   Example: `fix: Correct parsing error in custom_modes.yaml`
    *   Example: `docs: Update README with new installation instructions`
7.  **Push your changes to your fork:** `git push origin feature/your-feature-name`.
8.  **Open a Pull Request (PR)** against the `main` (or `develop`) branch of the original repository.
    *   Provide a clear title and description for your PR.
    *   Reference any related issues (e.g., "Closes #123").

## Pull Request Process

1.  Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2.  Update the `README.md` and other relevant documentation with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3.  Increase the version numbers in any examples and the `README.md` to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4.  Your PR will be reviewed by maintainers. They may ask for changes or provide feedback.
5.  Once your PR is approved and passes any CI checks, it will be merged.

## Development Setup (Example - to be customized for this project)

*(This section would need to be filled out with actual setup instructions for this project, e.g., language, package manager, key dependencies, how to run tests.)*

Example:
```bash
# Clone the repository
git clone https://github.com/your-repo/roo-ai-modes.git
cd roo-ai-modes

# Install dependencies (example for a Python project)
# python -m venv venv
# source venv/bin/activate
# pip install -r requirements.txt

# Run tests (example)
# pytest
```

## Coding Style

Please try to follow the existing coding style. If the project uses linters or formatters (e.g., Prettier, Black, ESLint), please run them before committing.

## Questions?

If you have any questions, feel free to open an issue or reach out to the maintainers.

Thank you for contributing!