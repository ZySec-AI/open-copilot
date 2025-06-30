# Contributing to This Project

Welcome! to OPEN COPLIOTS 🎉 We're excited that you're interested in contributing to this open-source project. We believe in open collaboration and value every effort to improve the software. Please take a moment to review this guide before submitting any code, issues, or documentation.

---

## 📌 Ground Rules

1. **Be Respectful**  
   Treat everyone with respect and professionalism. Harassment, discrimination, or abusive behavior will not be tolerated.

2. **Keep it Clean**  
   Make sure your contributions are well-tested, follow the coding standards, and don't break existing functionality.

3. **Use Git Properly**  
   - Keep PRs focused and minimal.
   - Write meaningful commit messages.
   - Rebase when necessary to keep a clean history.

4. **Ask First**  
   For major changes or new features, open an issue first to discuss what you'd like to change.

---

## 🚀 How to Contribute

### 1. Fork the Repository

Click the `Fork` button at the top of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

### 3. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Set Up Your Local Environment

Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 5. Make Changes

- Keep your changes focused.
- Follow the project's coding conventions and file structure.
- Add tests for new features or bug fixes.
- Don't commit secrets, credentials, or .env files.

### 6. Lint & Format

Ensure your code passes all linters and formatters.

```bash
pnpm lint
pnpm format
```

### 7. Commit and Push

```bash
git add .
git commit -m "feat: add feature description"
git push origin feature/your-feature-name
```

### 8. Submit a Pull Request

Go to your fork on GitHub and click "Compare & Pull Request". Follow the PR template and provide:

- A clear description of what you've changed.
- Any relevant issue numbers (e.g., "Closes #12").

---

## ✅ Pull Request Rules

- PRs must pass all CI checks.
- PR titles should follow Conventional Commits:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `refactor:`, `test:`, `chore:`, etc.
- One feature or fix per PR — avoid mixing unrelated changes. 