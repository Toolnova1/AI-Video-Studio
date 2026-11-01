# AI Video Studio

A self-hostable AI video creation workspace. The first milestone is the web studio UI and project structure; actual video generation requires a compatible GPU worker or hosted inference provider.

## Current status
- [x] Studio interface scaffold
- [x] Text-to-video and image-to-video input modes
- [x] Project settings (duration, aspect ratio, resolution)
- [x] Generation API contract and safe not-configured response
- [ ] Connect a licensed inference provider / GPU worker
- [ ] Add job queue, progress updates, storage and exports
- [ ] Add audio, scene planning and timeline editor

## Important
This repository does not bypass model/provider limits. GitHub stores source code; it does not provide GPU compute. A normal PC can run the web interface, but AI video inference needs remote GPU compute or a suitable local GPU. Free GPU demos have quotas, queues and availability limits.

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open http://localhost:3000.

## Configure generation later
Implement a server-side provider adapter in `lib/providers/`. Keep API keys in server environment variables; never expose secrets in browser code. Read `.env.example`.

## License
Choose a license only after checking the licenses of every model, dependency and asset you integrate.