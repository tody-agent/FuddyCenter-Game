FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Thiết lập môi trường không tương tác
ENV DEBIAN_FRONTEND=noninteractive

# Cài đặt Python 3, pip, git và các thư viện hỗ trợ render WebGL Headless & Playwright Test
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    xvfb \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    ca-certificates \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Chuyển quyền sang user node (non-root) để cô lập đặc quyền
USER node
WORKDIR /workspace

# Biến môi trường bảo vệ chống chạy script shell tự động ngoài ý muốn
ENV CI=true
ENV DISABLE_SKILL_SHELL_EXECUTION=true
