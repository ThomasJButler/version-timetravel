# GitHub Pages Deployment Guide

## Setup Instructions

### 1. Create and Push to New Branch

```bash
# Create a new branch from main
git checkout -b gh-pages-setup

# Add the GitHub Actions workflow
git add .github/workflows/deploy.yml vite.config.js
git commit -m "Add GitHub Pages deployment workflow"

# Push the new branch
git push -u origin gh-pages-setup
```

### 2. Create Pull Request

1. Go to your GitHub repository
2. Click "Pull requests" → "New pull request"
3. Set base: `main` and compare: `gh-pages-setup`
4. Create the pull request and merge it

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   - Don't select "Deploy from a branch"

### 4. Trigger Deployment

After merging the PR:
1. The workflow will automatically run on push to `main`
2. You can also manually trigger it:
   - Go to **Actions** tab
   - Select "Deploy to GitHub Pages"
   - Click "Run workflow"

### 5. Access Your Site

Once deployed, your site will be available at:
```
https://[your-username].github.io/version-timetravel/
```

## Important Notes

### Base Path Configuration

The `vite.config.js` has been updated with:
```javascript
base: '/version-timetravel/',
```

This ensures all assets load correctly on GitHub Pages.

### Static Assets

Make sure all your static assets in the legacy version files use relative paths or are hosted on CDN (like your Cloudinary images).

### Workflow Permissions

The workflow requires these permissions (already configured):
- `contents: read` - To checkout the code
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For OIDC authentication

## Troubleshooting

### Build Fails

1. Check the Actions tab for error logs
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test

### 404 Errors

If you get 404 errors:
1. Check that the base path in `vite.config.js` matches your repo name
2. Ensure all internal links use relative paths
3. Check that the workflow uploaded the `dist` folder correctly

### Assets Not Loading

1. Verify all asset paths are relative or absolute URLs
2. Check browser console for specific loading errors
3. Ensure CORS is not blocking external resources

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Create gh-pages branch
git checkout -b gh-pages

# Copy dist contents to root
cp -r dist/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Then set GitHub Pages to deploy from gh-pages branch
```

However, the GitHub Actions workflow is recommended for automatic deployments.