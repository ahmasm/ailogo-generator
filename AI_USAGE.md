# AI Usage

## Tools Used

- **Claude Code (Opus 4.5)** - Main coding assistant
- **Figma MCP** - Design reference

## What I Used AI For

- Initial project setup and boilerplate
- Component implementation from Figma design
- Zustand store setup with optimized selectors
- Cloud Function (Python) for job processing
- GitHub Actions CI workflow
- Debugging (Zustand infinite render loop)

## Example Prompts

- "StatusChip component'i processing, done, failed state'leriyle yaz"
- "Cloud Function job create edilince trigger olsun, 30-60sn beklesin, %90 success olsun"
- "useShallow nedir, neden infinite loop oluyor"

## What I Did Without AI

- Firebase Console setup (project creation, Firestore enable)
- Cloudflare R2 bucket configuration
- EAS Build setup and deployment
- Screen recording and video upload
- Final code review and testing on device

## Reflection

Claude Code significantly sped up the implementation - what would take 2-3 days was done in about 4 hours. The Figma MCP integration was especially useful for getting colors, spacing, and component structure right without manually inspecting every element.

The main thing I had to fix was a Zustand selector issue causing infinite re-renders. Claude generated selectors that returned new object references on each render. After pasting the error, it identified the problem and added `useShallow` wrappers.

I also removed the Maestro UI tests that Claude generated - they were syntactically correct but couldn't run on my physical device due to Android security restrictions. Rather than ship untested code, I decided to remove them.

Overall, I treated Claude as a pair programmer: I made the architectural decisions, it wrote the implementation, and I reviewed and tested everything. Every line of code in this repo is something I understand and can explain.
