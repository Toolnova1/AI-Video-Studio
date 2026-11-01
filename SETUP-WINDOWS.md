# Windows setup

This project uses your laptop for the web interface and lightweight orchestration. AI video inference runs through a remote provider; this 8 GB RAM laptop is not expected to run large video models locally.

## 1. Install prerequisites

Requirements:
- Windows 10/11 with Windows Package Manager (winget)
- Node.js LTS
- Python 3.11
- FFmpeg

From the repository folder, open PowerShell and run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup-windows.ps1
```

The script uses winget to install Node.js LTS, Python 3.11 and FFmpeg. Windows may ask you to approve installation.

Close and reopen PowerShell after installation, then verify:

```powershell
node --version
npm --version
py --version
ffmpeg -version
```

## 2. Install and run the web app

From the repository root:

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Connect fal.ai Wan 3 text-to-video

The first live provider adapter uses the fal.ai queue API with the Wan 3 text-to-video model. API generation may be billable; it is not an unlimited free API.

1. Create or sign in to a fal.ai account and review the current Wan 3 model price and your account billing settings.
2. Create an API key in your fal.ai dashboard.
3. In the project root (the same folder that contains package.json), create a new file named `.env.local`.
4. Put this line in it, replacing the example text with your own key:

```dotenv
FAL_KEY=your_fal_api_key_here
```

5. Save the file. Never paste the key into chat, GitHub, screenshots, or client-side code.
6. Stop the running development server with Ctrl+C, then start it again:

```powershell
npm run dev
```

The Generate button currently supports text-to-video requests of 5, 10 or 15 seconds at 720p or 1080p. Wan 3 generates short clips; long videos, scene stitching and image-to-video are later milestones. Check the provider's live pricing before every test because the provider may charge for API generations.

## 4. Python worker environment

The lightweight worker dependencies are listed in worker/requirements.txt. Create an isolated environment when we reach the worker implementation:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r worker/requirements.txt
```

## Hardware, privacy and cost notes

- Do not install CUDA or large local video models on this laptop.
- The fal.ai API key stays on the server in `.env.local`; do not expose it in browser code.
- Prompts and uploaded media sent to a hosted provider are processed by that provider. A private local app does not mean the provider cannot process the request.
- Free hosted inference may have quotas, queues, model restrictions or downtime.
- Long videos are assembled from multiple shorter generated clips.
- 4K export may require upscaling if the selected model does not generate native 4K.
