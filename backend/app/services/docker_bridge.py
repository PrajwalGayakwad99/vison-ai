import time

import docker
from docker.errors import ContainerError, ImageNotFound

_client: docker.DockerClient | None = None

# Per-language run commands. Java source is written to a temp file inside the container.
_COMMANDS: dict[str, list[str]] = {
    "python": ["python3", "-c"],          # code appended as final arg
    "javascript": ["node", "-e"],          # code appended as final arg
    # Java requires compile + run; handled separately below
}


def _get_client() -> docker.DockerClient:
    global _client
    if _client is None:
        _client = docker.from_env()
    return _client


def run_container(image: str, code: str, language: str = "python", timeout: int = 10) -> dict:
    """
    Execute code inside an isolated Docker container on the VPS.
    Returns a dict matching ExecuteResponse fields.
    """
    client = _get_client()

    # Build the shell command
    if language == "java":
        # Write source to Main.java, compile, then run
        shell_cmd = (
            "printf '%s' \"$CODE\" > /sandbox/Main.java "
            "&& javac /sandbox/Main.java "
            "&& java -cp /sandbox Main"
        )
        command: list[str] = ["sh", "-c", shell_cmd]
        environment = {"CODE": code}
    elif language in _COMMANDS:
        base = _COMMANDS[language]
        command = [*base, code]
        environment = {}
    else:
        return {
            "status": "error",
            "stdout": None,
            "stderr": f"Unsupported language: '{language}'.",
            "execution_time_ms": None,
        }

    start_time = time.perf_counter()
    try:
        output: bytes = client.containers.run(
            image=image,
            command=command,
            environment=environment if language == "java" else None,
            remove=True,
            mem_limit="128m",
            network_disabled=True,
            timeout=timeout,
        )
        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
        return {
            "status": "success",
            "stdout": output.decode("utf-8", errors="replace"),
            "stderr": None,
            "execution_time_ms": elapsed_ms,
        }
    except ContainerError as exc:
        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
        return {
            "status": "error",
            "stdout": None,
            "stderr": exc.stderr.decode("utf-8", errors="replace") if exc.stderr else str(exc),
            "execution_time_ms": elapsed_ms,
        }
    except ImageNotFound:
        return {
            "status": "error",
            "stdout": None,
            "stderr": f"Image '{image}' not found.",
            "execution_time_ms": None,
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "status": "error",
            "stdout": None,
            "stderr": str(exc),
            "execution_time_ms": None,
        }
