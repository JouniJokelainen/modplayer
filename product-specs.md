# A web-based MOD music player that streams ProTracker .mod files directly from modland.com/pub/modules/Protracker/

## Frontend Tech Stack
 
### Core Framework
- React 18+ - UI framework with hooks for state management
- TypeScript - Type safety and better developer experience
- Vite - Fast build tool and dev server
### MOD Playback
- xmp.js (or libopenmpt.js) - JavaScript MOD file decoder
- Web Audio API - Native browser audio playback engine
- AudioWorklet - High-performance audio processing for MOD synthesis
### UI/Styling
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - Pre-built accessible React components
- Lucide Icons - Modern icon library
### State & Data Management
- TanStack Query (React Query) - Server state & caching
- Zustand - Lightweight client state management
- React Router - Client-side routing (if needed for pages)
### HTTP & Data Fetching
- Axios - HTTP client for directory listing requests
- JSDOM / Cheerio - Optional: Parse HTML directory listings if needed

## Development & Build Tools
 
### Package Manager
- pnpm** or npm - Dependency management

### Development
- Vite - Dev server with HMR (hot reload)
- TypeScript Compiler - Type checking
- ESLint - Code linting
- Prettier - Code formatting

### Phase 1: Foundation & Setup
1. Initialize Vite + React + TypeScript project
2. Configure Tailwind CSS & shadcn/ui
3. Setup project structure and folder hierarchy
4. Configure tsconfig and Vite build settings

### Phase 2: MOD Playback Engine
1. Integrate libopenmpt.js or xmp.js decoder
2. Create Web Audio API context wrapper
3. Build custom AudioWorklet for MOD synthesis
4. Test with sample .mod file downloads

### Phase 3: Directory Browser & File Management
1. Implement modland.com directory scraper
2. Parse artist folder structure
3. Build TanStack Query hooks for caching
4. Create artist/track browsing components

### Phase 4: UI Components
1. Build Player component (main playback interface)
2. Create Controls component (buttons, sliders)
3. Build Playlist/Queue component
4. Add Visualizer (optional but cool)

### Phase 5: State Management & Polish
1. Integrate Zustand for playback state
2. Add settings/preferences UI
3. Implement keyboard shortcuts
4. Add visual feedback (loading, error states)

## Deployment Checklist
 
- [ ] Environment variables configured
- [ ] Build succeeds without warnings
- [ ] CORS issues resolved
- [ ] Audio playback tested
- [ ] Error boundaries implemented
- [ ] Loading states visible


