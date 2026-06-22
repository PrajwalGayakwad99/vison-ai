import docker
from docker.errors import ContainerError, ImageNotFound

_client: docker.DockerClient | None = None


def _get_client() -> docker.DockerClient:
    global _client
    if _client is None:
        _client = docker.from_env()
    return _client


def run_container(image: str, code: str, timeout: int = 10) -> dict:
    """
    Execute code inside an isolated Docker container on the VPS.
    Returns a dict matching ExecuteResponse fields.
    """
    client = _get_client()
    try:
        output: bytes = client.containers.run(
            image=image,
            command=["python", "-c", code],
            remove=True,
            mem_limit="128m",
            network_disabled=True,
            timeout=timeout,
        )
        return {
            "status": "success",
            "stdout": output.decode("utf-8", errors="replace"),
            "stderr": None,
        }
    except ContainerError as exc:
        return {
            "status": "error",
            "stdout": None,
            "stderr": exc.stderr.decode("utf-8", errors="replace") if exc.stderr else str(exc),
        }
    except ImageNotFound:
        return {"status": "error", "stdout": None, "stderr": f"Image '{image}' not found."}
    except Exception as exc:  # noqa: BLE001
        return {"status": "error", "stdout": None, "stderr": str(exc)}
