# Automated API Updates

This repository includes a GitHub Actions workflow that automatically keeps the Steam API types up to date.

## How It Works

The workflow (`.github/workflows/update-api-types.yml`) runs daily at 00:00 UTC and:

1. **Fetches** the latest Steam API definition from `api.steampowered.com`
2. **Checks** if `src/api-definition.json` has changed
3. **If changes are detected**:
   - Regenerates TypeScript types in `src/generated.ts`
   - Builds the project to verify everything compiles
   - Creates a Pull Request with the changes

## Manual Trigger

You can also manually trigger the workflow:

1. Go to the **Actions** tab in GitHub
2. Select **Update Steam API Types** workflow
3. Click **Run workflow**

## Reviewing Updates

When the workflow detects changes, it will create a PR with:

- Updated API definition
- Regenerated TypeScript types
- Build verification

Review the PR to ensure:

- The changes make sense
- No breaking changes were introduced
- Tests still pass (if you add them)

Then merge the PR to update the package.

## Workflow Schedule

- **Frequency**: Daily at 00:00 UTC
- **Trigger**: Automatic (scheduled) or manual
- **Action**: Creates PR only if changes detected

This ensures your package always has the latest Steam API types without manual intervention!
