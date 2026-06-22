FROM eclipse-temurin:21-jre-jammy
LABEL maintainer="Prajwal <dev@invincia.com>"

WORKDIR /sandbox

# Create unprivileged sandbox user
RUN useradd -m -s /bin/bash sandbox
USER sandbox

CMD ["java", "--version"]
