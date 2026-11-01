# AI Video Studio

A private, self-hostable AI video workspace. Your Windows laptop runs the web interface and lightweight orchestration; Wan 3 video inference runs through the fal.ai cloud API.

## Implemented in this version

- [x] Dark studio interface
- [x] Text-to-video using Wan 3
- [x] Image-to-video using an uploaded first-frame image
- [x] 2–30 second clip duration controls
- [x] 480p, 720p and 1080p output choices
- [x] 16:9, 9:16, 1:1, 4:3 and 3:4 aspect ratios
- [x] Generated audio enabled through the model
- [x] Asynchronous provider queue and status polling
- [x] Video preview and open/save link
- [x] Recent generated clips stored in browser local storage
- [x] Server-side API key handling

## Not implemented yet

- [ ] Multi-scene long-form video planner and automatic scene stitching
- [ ] Local FFmpeg export, transitions and final render pipeline
- [ ] Separate AI voiceover, music and sound-effect tracks
- [ ] Persistent server-side project database and user accounts
- [ ] Multiple provider routing / fallback
- [ ] Native 4K output (current Wan 3 integration offers up to 1080p)

A 30-second model request is a single clip, not an unrestricted long-form movie. Longer videos require a multi-scene workflow and several separate generation jobs. That feature is a later milestone.

## Requirements

- Windows 10/11
- Node.js LTS (Node 20+ recommended)
- FFmpeg (for the planned local editing/export milestone; not required for the current preview flow)
- A fal.ai account and API key for real cloud generation

## Run locally

From the repository root:

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Configure fal.ai

1. Create an API key at https://fal.ai/dashboard/keys.
2. In the project root, create a file named `.env.local`.
3. Add:

```dotenv
FAL_KEY=your_fal_api_key_here
```

4. Save the file and restart the dev server (Ctrl+C, then `npm run dev`).

Never put your API key in browser code, chat messages, screenshots or GitHub. The key must remain in `.env.local`, which is ignored by Git.

## Costs, limits and privacy

- API generation is not unlimited or guaranteed free. Check the live model price and account balance before each generation.
- fal.ai may provide a limited sandbox allowance; availability and terms can change.
- The model currently supports up to 1080p, not native 4K.
- Your prompts and uploaded images are sent to fal.ai for cloud inference. Keeping this app private does not prevent the provider from processing those inputs.
- Provider output URLs may be temporary; download important results to your own computer.

## Provider references

- Wan 3 text-to-video: https://fal.ai/models/alibaba/wan-3.0/text-to-video/api
- Wan 3 image-to-video: https://fal.ai/models/alibaba/wan-3.0/image-to-video/api

## License

Choose a license only after checking the licenses of all models, dependencies and assets you integrate.
