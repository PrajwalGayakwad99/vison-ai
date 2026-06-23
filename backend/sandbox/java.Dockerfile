FROM eclipse-temurin:21-jdk-jammy
LABEL maintainer="Prajwal <dev@vision-ai.com>"

WORKDIR /sandbox

# Create unprivileged sandbox user
RUN useradd -m -s /bin/bash sandbox
USER sandbox

CMD ["java", "--version"]
