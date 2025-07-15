# Files to Remove - Version TimeTravel Cleanup

## ✅ Completed Removals (v1.1 branch)

### 1. Unused CSS Files
- ✅ `/css/styles.css` - Not referenced anywhere in the codebase
- **Reason**: This appears to be a leftover file that's not imported by any HTML files

### 2. Unused JavaScript Files  
- ✅ `/js/timetravel.js` - Not referenced anywhere in the codebase
- **Reason**: Likely an old version of timeline functionality, now replaced by `/src/js/timeline.js`

### 3. Redundant Documentation
- ✅ `READMEv3.1.md` - Redundant version-specific README
- **Reason**: We have the main README.md which is comprehensive and up-to-date

### 4. Git-tracked but Non-existent Files
These show up in git status but don't actually exist:
- `todo.txt`
- `versionhistory.html` 
- `docs/` directory
- **Reason**: These were deleted but still tracked by git

## ✅ Fixed File References (v1.1 branch)

### 1. Version HTML Files with Bad Paths
- ✅ `version1.html` - Fixed CSS path from `src/css/version1.css` to `/css/version1.css`
- ✅ `version1.html` - Fixed JS path from `src/js/version1.js` to `/js/version1.js`
- ✅ `version2.html` - Fixed CSS path from `src/css/version2.css` to `/css/version2.css`
- ✅ `version2.html` - Fixed JS path from `src/js/version2.js` to `/js/version2.js`
- **Decision**: Fixed the paths to preserve these important journey showcases

## Consider for Removal (Redundant with Consolidated Versions)

### 1. ✅ v2.9 Files (Removed in v1.0.0 branch)
- ✅ `version29.html` - Removed (was nearly identical to version28.html)
- ✅ `/css/version29.css` - Removed
- ✅ `/css/globalv29.css` - Removed
- ✅ `/js/version29.js` - Removed
- **Reason**: v2.9 had minimal differences from v2.8 (just a title change and one URL)
- **Result**: Successfully removed to avoid confusion

### 2. Legacy Standalone Version Files (if content is preserved in /src/versions/)
Currently, you have:
- Standalone files: `version1.html`, `version2.html`, `version25.html`, `version28.html`, `version29.html`
- Consolidated versions in: `/src/versions/v1/index.html`, `/src/versions/v2/index.html`

**Note**: The consolidated versions have inline CSS/JS and learning documentation, while standalone files use external CSS/JS. Keep the standalone files for now as they're being used by the viewer.

## Project Structure Cleanup Summary

### Keep These Directories:
- `/src/` - Main application code (Vite-based)
- `/css/` - Legacy CSS files used by standalone versions
- `/js/` - Legacy JS files used by standalone versions
- Root HTML files - Used by the version viewer

### Remove These Files:
1. `/css/styles.css`
2. `/js/timetravel.js`
3. `READMEv3.1.md`
4. All v2.9 related files (after removing from versions.json)

### Fix These Files:
1. `version1.html` - Update CSS path
2. `version2.html` - Update CSS path

## ✅ Cleanup Completed

### v1.0.0 Branch:
- ✅ Removed v2.9 from timeline and all associated files
- ✅ Created comprehensive documentation (CLAUDE.md, MAINTENANCE.md)

### v1.1 Branch:
- ✅ **First Wave**: Removed unused files (styles.css, timetravel.js, READMEv3.1.md)
- ✅ **Path Fixes**: Fixed CSS/JS paths in version1.html and version2.html

### Remaining Tasks:
- Clean git tracking for non-existent files (todo.txt, versionhistory.html, docs/)
- Consider consolidating standalone version files once /src/versions/ is complete