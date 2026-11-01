# Windows setup

This project uses your laptop for the web interface and lightweight orchestration. AI video inference will run through a remote provider; this 8 GB RAM laptop is not expected to run large video models locally.

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

The script uses winget to install Node.js LTS, Python 3.11 and FFmpeg. Windows may still ask you to approve installation.

Close and reopen PowerShell after installation, then verify:

```powershell
node --version
npm --version
py --version
ffmpeg -version
```

## 2. Install the web app dependencies

From the repository root:

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Python worker environment

The lightweight worker dependencies are listed in worker/requirements.txt. Create an isolated environment when we reach the worker implementation:

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
- Long videos are assembled from multiple shorter generated clips.
- 4K export may require upscaling if the selected model does not generate native 4K.
