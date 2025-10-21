# Git Strategy - Weight Balance

## Branch Naming Conventions

### Main Branches
- **`main`**: Production-ready code, stable releases only
- **`develop`**: Integration branch for features, pre-release testing

### Feature Branches
- **`feature/task-name`**: Individual development tasks
  - Examples: `feature/cube-system`, `feature/placement-logic`, `feature/camera-controls`
- **`feature/chapter-name`**: Larger feature sets
  - Examples: `feature/chapter-1-levels`, `feature/rating-system`

### Release Branches
- **`release/v0.1.0`**: Release preparation and final testing
- **`release/v0.2.0`**: Future release branches

### Hotfix Branches
- **`hotfix/issue-description`**: Critical bug fixes for production
  - Examples: `hotfix/physics-glitch`, `hotfix/memory-leak`

### Documentation Branches
- **`docs/document-name`**: Documentation updates
  - Examples: `docs/api-documentation`, `docs/user-guide`

## Git Workflow

### Development Workflow
```
main ← develop ← feature/task-name
```

### Feature Development Process
1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/cube-system
   ```

2. **Develop feature** with regular commits
   ```bash
   git add .
   git commit -m "feat: implement cube weight visualization"
   ```

3. **Push feature branch** regularly
   ```bash
   git push origin feature/cube-system
   ```

4. **Create pull request** to `develop` when feature complete

5. **Code review** and merge to `develop`

6. **Delete feature branch** after merge

### Release Process
1. **Create release branch** from `develop`
   ```bash
   git checkout develop
   git checkout -b release/v0.1.0
   ```

2. **Final testing** and bug fixes on release branch

3. **Merge to main** when ready for production
   ```bash
   git checkout main
   git merge release/v0.1.0
   git tag v0.1.0
   ```

4. **Merge back to develop** to include any release fixes
   ```bash
   git checkout develop
   git merge release/v0.1.0
   ```

5. **Delete release branch** after merge

### Hotfix Process
1. **Create hotfix branch** from `main`
   ```bash
   git checkout main
   git checkout -b hotfix/critical-bug
   ```

2. **Fix critical issue** and test thoroughly

3. **Merge to main** immediately
   ```bash
   git checkout main
   git merge hotfix/critical-bug
   git tag v0.1.1
   ```

4. **Merge to develop** to include fix
   ```bash
   git checkout develop
   git merge hotfix/critical-bug
   ```

5. **Delete hotfix branch** after merge

## Commit Message Standards

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- **`feat`**: New feature
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, etc.)
- **`refactor`**: Code refactoring
- **`test`**: Adding or updating tests
- **`chore`**: Build process, dependencies, etc.
- **`perf`**: Performance improvements

### Scopes
- **`physics`**: Physics system changes
- **`cubes`**: Cube system changes
- **`camera`**: Camera controls
- **`placement`**: Placement system
- **`ui`**: User interface
- **`scene`**: Scene management
- **`build`**: Build system
- **`docs`**: Documentation

### Examples
```bash
feat(cubes): implement weight-based visual styling
fix(physics): resolve cube stacking glitch
docs(api): update cube creation documentation
refactor(camera): simplify orbit controls
test(placement): add surface detection tests
chore(deps): update three.js to latest version
perf(physics): optimize collision detection
```

### Commit Message Guidelines
- **Use present tense**: "add feature" not "added feature"
- **Use imperative mood**: "move cursor to..." not "moves cursor to..."
- **Capitalize first letter** of description
- **No period** at end of description
- **Limit first line** to 72 characters
- **Wrap body** at 72 characters
- **Reference issues** in footer: "Fixes #123"

## Semantic Versioning

### Version Format: `MAJOR.MINOR.PATCH`

### Version Increments
- **MAJOR (1.0.0)**: Breaking changes, incompatible API changes
- **MINOR (0.2.0)**: New features, backward compatible
- **PATCH (0.1.1)**: Bug fixes, backward compatible

### Pre-release Versions
- **Alpha**: `0.1.0-alpha.1` - Early development, unstable
- **Beta**: `0.1.0-beta.1` - Feature complete, testing phase
- **RC**: `0.1.0-rc.1` - Release candidate, final testing

### Version History
- **v0.1.0**: Minimal Physics Prototype
- **v0.2.0**: Core Gameplay (levels, progression)
- **v0.3.0**: Rating System
- **v0.4.0**: Advanced Platforms
- **v1.0.0**: Full Game Release

## Release Tagging Strategy

### Tag Format
```bash
git tag -a v0.1.0 -m "Release v0.1.0: Minimal Physics Prototype"
```

### Tag Message Format
```
Release v0.1.0: Minimal Physics Prototype

Features:
- Basic physics simulation with Cannon-es
- Cube placement system
- Camera orbit controls
- Restart functionality

Bug Fixes:
- Fixed cube stacking physics glitch
- Resolved camera jumping issue

Breaking Changes:
- None

Migration Guide:
- None required for this release
```

### Tagging Process
1. **Create annotated tag** with release message
2. **Push tags** to remote repository
   ```bash
   git push origin v0.1.0
   ```
3. **Create GitHub release** from tag
4. **Update CHANGELOG.md** with release notes

## When to Branch vs. Commit to Main

### Commit Directly to Main
- **Documentation updates** (README, docs/)
- **Minor bug fixes** that don't affect functionality
- **Build system changes** (package.json, vite config)
- **Dependency updates** (security patches)

### Create Feature Branch
- **New features** or significant functionality
- **Refactoring** that changes code structure
- **Performance improvements** that modify logic
- **UI/UX changes** that affect user experience

### Create Hotfix Branch
- **Critical bugs** that break core functionality
- **Security vulnerabilities** that need immediate fix
- **Performance regressions** that affect gameplay

## Branch Protection Rules

### Main Branch Protection
- **Require pull request** reviews before merging
- **Require status checks** to pass before merging
- **Require branches** to be up to date before merging
- **Restrict pushes** to main branch
- **Require linear history** (no merge commits)

### Develop Branch Protection
- **Require pull request** reviews for feature merges
- **Require status checks** to pass
- **Allow force pushes** for rebasing (with caution)

## Merge Strategies

### Feature Branches → Develop
- **Use "Squash and merge"** to keep clean history
- **Single commit** per feature for easy tracking
- **Clear commit message** describing entire feature

### Develop → Main
- **Use "Create merge commit"** to preserve feature history
- **Merge commit message** should reference release notes
- **Tag immediately** after merge

### Hotfix Branches → Main
- **Use "Squash and merge"** for single-commit fixes
- **Tag immediately** after merge
- **Cherry-pick** to develop if needed

## Conflict Resolution

### Merge Conflicts
1. **Pull latest changes** from target branch
2. **Resolve conflicts** manually in affected files
3. **Test thoroughly** after resolution
4. **Commit resolution** with clear message
5. **Continue with merge** process

### Rebase Conflicts
1. **Stop rebase** when conflicts occur
2. **Resolve conflicts** in affected files
3. **Add resolved files** to staging
4. **Continue rebase** with `git rebase --continue`
5. **Test thoroughly** after rebase completion

## Backup and Recovery

### Regular Backups
- **Push to remote** repository regularly
- **Create backup branches** for major features
- **Tag stable points** for easy recovery

### Recovery Procedures
- **Reset to last known good commit**
  ```bash
  git reset --hard <commit-hash>
  ```
- **Revert problematic commits**
  ```bash
  git revert <commit-hash>
  ```
- **Cherry-pick** specific commits from other branches
  ```bash
  git cherry-pick <commit-hash>
  ```

## Collaboration Guidelines

### Code Review Process
1. **Self-review** before requesting review
2. **Request review** from at least one team member
3. **Address feedback** promptly and thoroughly
4. **Test changes** after addressing feedback
5. **Merge only** after approval

### Communication
- **Use pull request comments** for code-specific discussions
- **Use issues** for bug reports and feature requests
- **Use project boards** for task tracking
- **Use commit messages** for change documentation

### Code Quality
- **Follow coding standards** defined in .cursorrules
- **Write clear commit messages** following conventions
- **Test changes** before committing
- **Document complex logic** with comments
- **Keep commits focused** and atomic
