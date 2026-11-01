# Windows setup

This project uses your laptop for the web interface and lightweight orchestration. AI video inference runs through a remote provider; this 8 GB RAM laptop is not expected to run large video models locally.

## 1. Install prerequisites

Requirements:
- Windows 10/11 with Windows Package Manager (winget)
- Node.js LTS
- Python 3.11 (reserved for the future worker)
- FFmpeg (reserved for local editing/export milestone)

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

From the inner repository root (the folder containing package.json):

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Connect fal.ai Wan 3

The app currently supports Wan 3 text-to-video and image-to-video through the fal.ai queue API. The provider supports 2–30 second clips, 480p/720p/1080p, and generated audio. Check live pricing and account billing before generating; API calls may be billable.

1. Create or sign in to a fal.ai account and review the current model price.
2. Create an API key at https://fal.ai/dashboard/keys.
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

7. Open http://localhost:3000, choose Text to video or Image to video, write a prompt, set duration/resolution and click Generate.

For image-to-video, upload a JPG, PNG or WEBP image up to 10 MB. The app sends the image to fal.ai as a data URI through the server route.

## 4. Current limitations

- This milestone generates one short clip per job (2–30 seconds).
- Long-form scene planning and automatic joining of multiple clips are not implemented yet.
- Separate voiceover, music and sound-effect tracks are not implemented; the Wan 3 request asks the model to generate audio with the video.
- Native 4K is not available through this model integration; current maximum is 1080p.
- Generated results are listed in this browser's local storage. Download important videos because provider URLs may be temporary.
- Prompts and uploaded images are sent to fal.ai for remote processing. A private local app does not mean the provider cannot process the request.

## 5. Future Python worker environment

The lightweight worker dependencies are listed in worker/requirements.txt. Create an isolated environment only when we reach the worker implementation:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r worker/requirements.txt
```

## Hardware and cost notes

- Do not install CUDA or large local video models on this laptop.
- Keep provider API keys in server-side environment variables only.
- Free hosted inference may have quotas, queues, model restrictions or downtime.
- Long videos will require multiple paid/free clip jobs plus local FFmpeg editing.
