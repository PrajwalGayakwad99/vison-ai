FROM node:20-slim
LABEL maintainer="Prajwal <dev@vision-ai.com>"

WORKDIR /sandbox

# Create unprivileged sandbox user
RUN useradd -m -s /bin/bash sandbox
USER sandbox

CMD ["node"]
