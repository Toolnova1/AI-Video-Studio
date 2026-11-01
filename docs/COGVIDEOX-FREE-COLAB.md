# CogVideoX free Colab workflow

This project adds a guided entry point at `/free-gpu` for testing the official CogVideoX notebooks.

## Why CogVideoX INT8

The official [zai-org/CogVideo README](https://github.com/zai-org/CogVideo) explicitly lists Colab T4 notebooks and says quantization with the Diffusers implementation can reduce VRAM enough for free T4 Colab sessions. It lists the INT8 text-to-video notebook at approximately 30 minutes per run. This is a best-effort route, not a guarantee of a free GPU allocation or a successful run on every Colab session.

## Launch notebooks

- Text-to-video INT8: https://colab.research.google.com/drive/1DUffhcjrU-uz7_cpuJO3E_D4BaJT7OPa?usp=sharing
- Image-to-video: https://colab.research.google.com/drive/17CqYCqSwz39nZAX2YyonDxosVKUZGzcX?usp=sharing

## Important architecture boundary

The notebooks run on Google's temporary Colab runtime. They are not a persistent inference API and are not connected to this Next.js app's `/api/generate` route or Generate Video button. The generated MP4 must be downloaded from Colab and imported manually. A future live integration would require a separately hosted, authenticated inference endpoint; a temporary Colab notebook should not be treated as a production backend.

## $0 guardrails

- Select a T4 runtime only when it is offered without payment.
- Do not purchase Colab compute units or upgrade for this workflow.
- Save generated MP4 files locally before the runtime disconnects.
- Model weights, notebook dependencies, generation time and free GPU availability remain subject to provider terms and quotas.

## Model and license

See the official [CogVideo repository](https://github.com/zai-org/CogVideo) for model-specific license terms. CogVideoX-2B is Apache 2.0; do not assume that license applies to every model variant or associated asset.
