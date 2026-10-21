# StudyBuddy Development Status and Build Diagnosis

This file is the single source of truth for current development state, migration context, deployment readiness, and Android `java.io.IOException` diagnosis.

## 1) Current State

- Active runtime at repo root is Expo + React Native (`expo`, `react-native` and Expo scripts are in root `package.json`).
- The repository is in a migration phase from older web/Next.js structure to mobile-first Expo structure.
- A second app scaffold also exists under `StudyBuddyMobile/` with a newer Expo SDK and dependency graph.
- Deployment config currently exists at root via `app.json` and `eas.json`.

## 2) What We Want To Achieve

- Keep one canonical mobile app target for builds.
- Remove ambiguity between root app and `StudyBuddyMobile/`.
- Stabilize Android EAS build pipeline for preview and production.
- Keep documentation centralized in one place to avoid drift.

## 3) Files That Were Development-Only Documentation

After review, these files contained development/process documentation and no runtime logic:

- `README.md` (previously mixed outdated setup and stack details).
- Legacy `app/deployment-guide.mdx` content (already removed from working tree, partially recoverable from git history).

Note: `.expo/README.md` is Expo-generated local metadata guidance and should stay local; it is not a maintained project document.

## 4) Consolidated Development Knowledge

### Stack Reality

- Root app currently declares Expo SDK 53 (`expo: ^53.0.0`), React Native `0.79.x`, React `19.0.0`.
- `StudyBuddyMobile/` declares Expo SDK 54 and RN `0.81.x`.
- This dual-stack setup is high-risk for dependency and build confusion.

### Environment and Secrets

- Root env templates still include historical keys from multiple backends/services.
- Active Expo client-safe keys should use `EXPO_PUBLIC_*` when needed on device.
- Never commit real secrets (`.env` remains local-only).

### Build Profiles

From `eas.json`:
- `development`: internal APK (dev client).
- `preview`: APK.
- `production`: Android app bundle.

## 5) Why Deployment Is Failing (`java.io.IOException`)

The most likely root cause is repository/state inconsistency rather than one Java API bug:

1. Two competing app roots (root + `StudyBuddyMobile`) with different SDK generations.
2. Local native build cache footprint under `android/.gradle` present in project workspace.
3. No `.easignore`, so EAS upload context is larger and noisier than needed.
4. Migration leftovers create a high chance of prebuild/Gradle path mismatch and stale artifact cleanup failures (a common source of Android `java.io.IOException` in Expo/Gradle runs).

In short: build context contamination + mixed project generations is the likely trigger.

## 6) How Far We Are From Stable Goal

- **Current confidence**: medium for local dev, low-medium for cloud Android release build consistency.
- **Distance to goal**: about 5 focused steps.

### Step 1: Canonicalize app root
- Decide one deployable app root (recommended: repository root, unless intentionally migrating to `StudyBuddyMobile/`).

### Step 2: Isolate EAS upload scope
- Maintain `.easignore` to exclude non-target app trees and local caches.

### Step 3: Clean native artifacts
- Remove local Gradle cache folders from repository context (`android/.gradle` etc.).

### Step 4: Version alignment check
- Run dependency health checks and align Expo package versions for chosen app root.

### Step 5: Reproduce and verify
- Run local release-equivalent Android build checks, then EAS preview build.

## 7) Immediate Operational Checklist

1. Run `npx expo-doctor`.
2. Run `npx expo install --check`.
3. Ensure only one app root is built by EAS.
4. Keep `android/.gradle` out of repo/build context.
5. Retry `eas build --platform android --profile preview`.

## 10) Latest Validation Snapshot

`npx expo-doctor` was executed and reported 4 important failures:

1. `.expo` state should remain ignored/untracked.
2. Missing required peer dependency: `expo-font` (required by `@expo/vector-icons`).
3. Expo support-package skew (`@expo/config-plugins`, `@expo/metro-config` not at expected lines for this SDK set).
4. Core package drift from expected Expo 53 patch set (`expo`, `react-native`, and multiple Expo modules behind recommended versions).

These mismatches materially increase the probability of Android EAS Gradle instability and IOException-like failures during build phases.

## 11) Remediation Executed

The following stabilization actions were completed:

- Added missing peer dependency support by aligning test renderer for React 19 (`react-test-renderer`).
- Installed required Expo peer dependency (`expo-font`).
- Upgraded Expo SDK 53 support package set to expected compatible versions.
- Normalized `@types/react` to the version expected by Expo SDK 53 checks.
- Removed `.expo` from git tracking (`git rm -r --cached .expo`) while keeping it ignored locally.

### Current validation status

- `npx expo-doctor` -> **17/17 checks passed**.
- `npx expo install --check` -> **Dependencies are up to date**.

This closes the configuration-level blockers that were contributing to Android build instability and reduces the likelihood of `java.io.IOException` during EAS Android build phases.

## 8) Legacy Deployment Notes (Recovered)

Recovered historical notes indicate older deployment assumptions around:
- Firebase-first setup.
- Vercel hosting.
- Mini-omni server integration.

These are migration-era notes and should be treated as historical context, not current deployment source of truth.

## 9) Ownership Going Forward

Update this file whenever:
- SDK or runtime versions change.
- Build pipeline changes.
- A new root-cause pattern is confirmed from EAS logs.

