# Files to Remove - Version TimeTravel Cleanup

## Definitely Safe to Remove

### 1. Unused CSS Files
- `/css/styles.css` - Not referenced anywhere in the codebase
- **Reason**: This appears to be a leftover file that's not imported by any HTML files

### 2. Unused JavaScript Files  
- `/js/timetravel.js` - Not referenced anywhere in the codebase
- **Reason**: Likely an old version of timeline functionality, now replaced by `/src/js/timeline.js`

### 3. Redundant Documentation
- `READMEv3.1.md` - Redundant version-specific README
- **Reason**: We have the main README.md which is comprehensive and up-to-date

### 4. Git-tracked but Non-existent Files
These show up in git status but don't actually exist:
- `todo.txt`
- `versionhistory.html` 
- `docs/` directory
- **Reason**: These were deleted but still tracked by git

## Files with Broken References (Need Fixing or Removal)

### 1. Version HTML Files with Bad Paths
- `version1.html` - References `src/css/version1.css` but should be `/css/version1.css`
- `version2.html` - References `src/css/version2.css` but should be `/css/version2.css`
- **Decision**: Fix the paths rather than remove (these showcase your journey)

## Consider for Removal (Redundant with Consolidated Versions)

### 1. v2.9 Files
- `version29.html` - Nearly identical to version28.html
- `/css/version29.css` - Likely very similar to version28.css
- `/css/globalv29.css` - Likely very similar to global.css
- `/js/version29.js` - Likely very similar to version28.js
- **Reason**: v2.9 has minimal differences from v2.8 (just a title change and one URL)
- **Recommendation**: Remove v2.9 entirely to avoid confusion

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

## Recommended Cleanup Order

1. **First Wave** (Definitely safe):
   - Remove `/css/styles.css`
   - Remove `/js/timetravel.js`
   - Remove `READMEv3.1.md`
   - Clean git tracking for non-existent files

2. **Second Wave** (After v2.9 removal from timeline):
   - Remove `version29.html`
   - Remove `/css/version29.css`
   - Remove `/css/globalv29.css`
   - Remove `/js/version29.js`

3. **Third Wave** (Path fixes):
   - Fix CSS paths in `version1.html`
   - Fix CSS paths in `version2.html`