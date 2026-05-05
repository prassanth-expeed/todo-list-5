# Default dev environment for this speckit project. Copied to
# {project}/.specify/Dockerfile on project creation — edit it there to add
# project-specific tooling (e.g. Go, Rust, Java, extra apt packages). The
# image is built lazily on first IMPLEMENTATION bash call and is unique to
# this project (tag: speckit-{project}:latest). Deleted automatically when
# the project is deleted.
#
# Default toolchain:
#   - Node 20 LTS (node, npm, npx)
#   - Python 3 (python3, pip, venv)
#   - git, curl, jq, build-essential, ca-certificates
#   - Playwright (Chromium) — for VERIFICATION phase end-to-end tests.
#     Remove the Playwright block below if this project doesn't need E2E
#     (saves ~400 MB in the image).
#
# The host project is bind-mounted at /workspace, so file writes land on the
# host's project folder. Playwright browser binaries live at
# /ms-playwright-browsers (outside the mount, baked into the image).
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_MAJOR=20 \
    PATH=/usr/local/bin:/usr/bin:/bin \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright-browsers

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        git \
        jq \
        build-essential \
        python3 \
        python3-pip \
        python3-venv \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Playwright + Chromium. `--with-deps` installs the system libs Chromium needs
# (libnss3, libxkbcommon, libasound2, fonts, etc.). Browsers land at
# $PLAYWRIGHT_BROWSERS_PATH so they survive container recreates without
# bloating the bind-mounted project folder.
RUN npm install -g @playwright/test \
    && mkdir -p ${PLAYWRIGHT_BROWSERS_PATH} \
    && npx --yes playwright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Keep the container alive; actual commands arrive via `docker exec`.
CMD ["sleep", "infinity"]
