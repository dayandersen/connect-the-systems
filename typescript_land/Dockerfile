FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json bun.lockb* ./

# Install dependencies if package.json exists
RUN if [ -f package.json ]; then bun install --frozen-lockfile; fi

# Copy all files from current directory
COPY . .

# Build TypeScript if tsconfig.json exists
RUN if [ -f tsconfig.json ]; then bun run build 2>/dev/null || echo "No build script found, skipping build"; fi

# Default entrypoint - allows passing TypeScript/JavaScript file as argument
ENTRYPOINT ["bun", "run"]
