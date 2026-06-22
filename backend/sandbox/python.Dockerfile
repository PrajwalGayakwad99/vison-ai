FROM python:3.11-slim
LABEL maintainer="Prajwal <dev@invincia.com>"

WORKDIR /sandbox

# Create unprivileged sandbox user
RUN useradd -m -s /bin/bash sandbox
USER sandbox

# No network, no file writes outside /tmp
CMD ["python3", "-I"]
