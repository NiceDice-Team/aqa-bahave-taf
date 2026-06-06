# Project Cleanup Plan

**Date:** February 2, 2026  
**Status:** Ready for execution

---

## 🗑️ Items to Remove

### 1. Empty \_disabled Feature Folders

**Location:** `features/_disabled/`

- `features/_disabled/cart/` (empty)
- `features/_disabled/catalog/` (empty)
- `features/_disabled/checkout/` (empty)

**Reason:** All features have been moved to active folders. These empty directories serve no purpose.

**Action:** Remove entire `features/_disabled/` directory

---

### 2. Outdated Planning Documents

**Files:**

- `DEVELOPMENT_PLAN.md` (454 lines)
- `IMPLEMENTATION_PLAN.md` (2,231 lines)

**Reason:** These were initial planning documents created before implementation. Now outdated and superseded by:

- `COVERAGE_SUMMARY.md` - Current and accurate test coverage
- Actual implemented code
- Feature files themselves

**Keep:** `COVERAGE_SUMMARY.md` (current, actively maintained)

**Action:** Remove both planning documents

---

### 3. Misplaced launch.json

**Location:** `/launch.json` (root directory)

**Reason:** VS Code launch configurations should be in `.vscode/launch.json`, not in project root.

**Action:**

- Move to `.vscode/launch.json` if .vscode folder exists, OR
- Remove if not used for debugging

---

### 4. Test Output Artifacts (Optional)

**Directories:**

- `reports/` (628KB)
- `test-results/` (4KB)

**Reason:** These contain test execution results that should be regenerated on each run.

**Note:** Check if these are in `.gitignore` (they should be)

**Action:** Clean but don't remove directories (they'll regenerate on test runs)

---

### 5. Unused test-config.spec.ts (Optional Review)

**Location:** `tests/test-config.spec.ts`

**Purpose:** Basic configuration validation tests

**Review:** Check if this is still useful or if it can be removed

---

## ✅ Items to Keep

### Essential Configuration

- `.env` and `.env.example` - Environment configuration
- `playwright.config.ts` - Test runner configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` / `package-lock.json` - Dependencies

### Documentation

- `README.md` - Project overview
- `COVERAGE_SUMMARY.md` - Current test coverage (KEEP!)
- `LICENSE` - Project license

### Source Code

- `steps/` - All step definitions (7 files) ✅
- `page-objects/` - Page Object Models ✅
- `features/` - Active feature files (10 files) ✅
- `adapters/` - API/Web adapters ✅
- `helpers/` - Utility helpers ✅
- `sdk/` - SDK implementations ✅
- `config/` - Configuration files ✅
- `constants/` - Constants ✅
- `interfaces/` - TypeScript interfaces ✅
- `fixtures/` - Test data ✅
- `utils/` - Utilities ✅
- `support/` - Test support (world.ts) ✅

### Generated Files

- `.features-gen/` - Auto-generated test specs (regenerated on build)

---

## 📋 Cleanup Commands

### Safe Cleanup (Recommended)

```bash
# 1. Remove empty _disabled folders
rm -rf features/_disabled/

# 2. Remove outdated planning documents
rm DEVELOPMENT_PLAN.md IMPLEMENTATION_PLAN.md

# 3. Move or remove launch.json
mv launch.json .vscode/launch.json
# OR if not needed:
# rm launch.json

# 4. Clean test output (regenerates automatically)
rm -rf reports/* test-results/*

# 5. Verify what's left
git status
```

### Verify After Cleanup

```bash
# Regenerate tests to ensure nothing broke
npx bddgen test

# List active features
find features -name "*.feature" -type f

# Count: should show 10 features
find features -name "*.feature" -type f | wc -l
```

---

## 🎯 Expected Results

### File Structure After Cleanup

```
aqa-bahave-taf/
├── .env
├── .env.example
├── .gitignore
├── COVERAGE_SUMMARY.md ✅ (keep - current)
├── LICENSE
├── README.md
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── .vscode/
│   └── launch.json (moved here)
├── adapters/ (10 files)
├── config/ (1 file)
├── constants/ (2 files)
├── features/ (10 .feature files)
│   ├── users/ (3 features)
│   ├── cart/ (2 features)
│   ├── catalog/ (1 feature)
│   └── checkout/ (4 features)
├── fixtures/
├── helpers/ (1 file)
├── interfaces/ (5 files)
├── page-objects/ (11 files)
├── sdk/ (6 files)
├── steps/ (8 files) ✅
├── support/ (1 file)
├── tests/ (1 file)
└── utils/ (1 file)
```

### Benefits

- ✅ Cleaner repository
- ✅ No outdated documentation
- ✅ No empty folders
- ✅ Easier navigation
- ✅ Current documentation only (COVERAGE_SUMMARY.md)
- ✅ Reduced confusion for new developers

---

## ⚠️ Important Notes

1. **Before cleanup:** Ensure all changes are committed to git
2. **Test after cleanup:** Run `npx bddgen test` to regenerate specs
3. **Verify tests:** Run at least one test to ensure nothing broke
4. **Git status:** Check `git status` to see what was removed

---

## 🚀 Quick Execute (All Commands)

```bash
# Navigate to project
cd /Users/oleksandrdoroshenko/projects/NiceDice/aqa-bahave-taf

# Execute cleanup
rm -rf features/_disabled/
rm DEVELOPMENT_PLAN.md IMPLEMENTATION_PLAN.md
mkdir -p .vscode && mv launch.json .vscode/launch.json 2>/dev/null || rm launch.json
rm -rf reports/* test-results/*

# Verify
echo "✅ Cleanup complete!"
git status
npx bddgen test
```

---

## Summary

**Total files to remove:**

- 3 empty folders
- 2 large outdated planning docs (~2,700 lines)
- 1 misplaced config file
- Test output artifacts (auto-regenerate)

**Result:** Cleaner, more maintainable project with current documentation only.
