FROM alpine:latest

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Create symlink for python command
RUN ln -sf python3 /usr/bin/python

# Install uv for faster package management (optional)
RUN pip install --break-system-packages uv

# Set working directory
WORKDIR /app

# Copy all files from current directory
COPY . .

# Install requirements if they exist
RUN if [ -f requirements.txt ] && [ -s requirements.txt ]; then uv pip install --system -r requirements.txt; fi

# Default entrypoint - allows passing python file as argument
ENTRYPOINT ["python"]
