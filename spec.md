# Specification

## Summary
**Goal:** Build a complete frontend for the CoFoundrAI AI Startup Co-Founder Platform that connects to an existing FastAPI backend and guides users through a 7-step AI-powered startup analysis workflow.

**Planned changes:**
- Create an Axios-based API service module (`api.ts`) with typed functions for all 7 backend endpoints (`/analyze`, `/simulate`, `/image`, `/report`, `/linkedin`, `/autopost`, `/mcp/metrics`) targeting `http://127.0.0.1:8000`
- Create a global Zustand store (`useCoFoundrStore.ts`) persisting idea text, all API results, and per-step loading/error states
- Build a Landing Page with a React Three Fiber animated 3D particle/geometric hero background, CoFoundrAI branding, tagline, and "Analyze Your Idea" CTA navigating to `/dashboard`
- Build a persistent glassmorphism Sidebar with links to all 7 workflow pages, active route highlighting, and collapsible icon-rail on mobile
- Build a Workflow Progress Tracker component showing all 7 steps with idle/loading/completed/error states driven by global state
- Build a Dashboard page with idea textarea, Analyze button calling `POST /analyze`, full-page loading overlay, and Agent Results Panel showing Business Analysis, Market Analysis, Tech Feasibility, Risk Analysis, and Validation Score in glassmorphism cards
- Build a Simulation page calling `POST /simulate` on load (if analyzeResult exists), displaying Recharts line chart for market growth and bar/gauge chart for success probability
- Build a Brochure page with "Generate Brochure" button calling `POST /image`, displaying the returned image in a preview card with a download link
- Build a Report page with "Generate Report" button calling `POST /report`, offering PDF download and inline preview modal
- Build a LinkedIn page generating a post via `POST /linkedin` into an editable textarea, with an "Auto-Post" button calling `POST /autopost`
- Build a Metrics page calling `GET /mcp/metrics` on mount with stat cards for Agent Executions, System Performance, and Request Counts, plus auto-refresh every 30 seconds and a manual refresh button
- Build a global Toast notification system (`ToastProvider.tsx` + `useToast` hook) with success/error/info variants, auto-dismiss after 4 seconds, stacked top-right positioning
- Apply a cohesive premium dark SaaS theme across all pages: dark base (`#0a0a0f`), glassmorphism cards, cyan-to-violet gradient accents, neumorphic shadows, animated gradient background blobs, 3D hover depth transforms, and Framer Motion page/component entrance animations

**User-visible outcome:** Users can enter a startup idea, run it through a full AI analysis workflow (analyze → simulate → brochure → report → LinkedIn post → auto-post → metrics), view rich visualizations and AI-generated content at each step, and download or share results — all within a premium dark futuristic single-page app without any page reloads.
