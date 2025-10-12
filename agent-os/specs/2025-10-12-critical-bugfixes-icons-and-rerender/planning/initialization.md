# Initial Spec Idea

## User's Initial Description
**Project:** Goblinstadt Resource Manager - Critical Bugfixes

**Description:**
Fix two critical issues with the recently implemented modernization:

1. **Missing Icons Problem**: Some resources do not have icons displaying. Every resource (all 32) must have a visible icon. Need to investigate which icons are missing and fix the icon mappings or fallbacks.

2. **Disruptive Re-render on +/- Actions**: When clicking +/- buttons to add/subtract resources, the entire page rebuilds with the same animation as tab switching. This is disruptive and slow. The +/- actions must be instant without full page re-render, while tab switching should keep its current animation.

**Context:**
- This is a bugfix for the existing implementation at: `agent-os/specs/2025-10-12-modernize-and-beautify-project/`
- The app is a vanilla JavaScript PWA (no frameworks)
- Files involved: `app.js` (icon mappings, renderUI function), `styles.css` (animations)

Initialize the spec folder and save this raw idea.

## Metadata
- Date Created: 2025-10-12
- Spec Name: critical-bugfixes-icons-and-rerender
- Spec Path: agent-os/specs/2025-10-12-critical-bugfixes-icons-and-rerender
