"""
Sandbox Execution Service
=========================
Safely executes user-submitted Python code in a Docker container.
Uses subprocess to run Docker with strict timeout protection.
"""

from __future__ import annotations

import subprocess
import time
from typing import Literal


def execute_code(
    code: str,
    language: Literal["python"] = "python",
    timeout: int = 5,
) -> dict:
    """
    Execute code inside a Docker container and return the result.

    Args:
        code: The Python source code to execute
        language: Programming language (currently only "python" supported)
        timeout: Maximum execution time in seconds (default: 5)

    Returns:
        dict with keys:
            - status: "success" | "error" | "timeout"
            - stdout: stdout output as string
            - stderr: stderr output as string
            - execution_time_ms: execution time in milliseconds
    """
    start_time = time.perf_counter()

    # Map language to Docker image
    image_map = {
        "python": "vision-ai-python",
    }
    image = image_map.get(language, "vision-ai-python")

    try:
        # Run Docker container with the code as stdin
        result = subprocess.run(
            ["docker", "run", "--rm", "-i", image],
            input=code.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout,
        )

        elapsed_ms = int((time.perf_counter() - start_time) * 1000)

        return {
            "status": "success",
            "stdout": result.stdout.decode("utf-8", errors="replace"),
            "stderr": result.stderr.decode("utf-8", errors="replace"),
            "execution_time_ms": elapsed_ms,
        }

    except subprocess.TimeoutExpired:
        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
        return {
            "status": "timeout",
            "stdout": None,
            "stderr": f"Execution timed out after {timeout} seconds. Your code may contain an infinite loop.",
            "execution_time_ms": elapsed_ms,
        }

    except FileNotFoundError:
        return {
            "status": "error",
            "stdout": None,
            "stderr": "Docker is not installed or not in PATH. Please install Docker to run code.",
            "execution_time_ms": None,
        }

    except Exception as e:
        return {
            "status": "error",
            "stdout": None,
            "stderr": str(e),
            "execution_time_ms": None,
        }


def visualize_code(code: str, timeout: int = 10) -> dict:
    """
    Execute Python code with visual tracing inside a Docker container.

    This function injects the tracer script alongside the user's code,
    executes it, and returns the step-by-step execution timeline.

    Args:
        code: Python source code to visualize
        timeout: Maximum execution time in seconds (default: 10)

    Returns:
        dict with keys:
            - status: "ok" | "syntax_error" | "error" | "timeout"
            - timeline: list of execution steps
            - total_steps: number of steps captured
    """
    import json

    start_time = time.perf_counter()

    # The tracer script that will be injected
    tracer_script = '''import sys, json

def trace_func(frame, event, arg):
    global step_counter, timeline
    if step_counter[0] >= 1000:
        timeline.append({"step": step_counter[0]+1, "line": frame.f_lineno, "variables": {}, "event": "error", "error": "Execution stopped: infinite loop detected (>1000 steps)"})
        return None

    if event == "line":
        step_counter[0] += 1
        local_vars = {}
        try:
            for k, v in frame.f_locals.items():
                if not k.startswith("__"):
                    try:
                        r = repr(v)
                        local_vars[k] = r[:200] if len(r) > 200 else r
                    except:
                        local_vars[k] = f"<{type(v).__name__}>"
        except: pass
        timeline.append({"step": step_counter[0], "line": frame.f_lineno, "variables": local_vars, "event": "line"})
    elif event == "return":
        step_counter[0] += 1
        timeline.append({"step": step_counter[0], "line": frame.f_lineno, "variables": {"__return__": repr(arg) if arg else "None"}, "event": "return"})
    return trace_func

# User code
USER_CODE = """{user_code}"""

timeline = []
step_counter = [0]

try:
    compiled = compile(USER_CODE, "<visualize>", "exec")
    ns = {"__name__": "__main__", "__builtins__": __builtins__}
    sys.settrace(trace_func)
    exec(compiled, ns)
except SyntaxError as e:
    timeline.append({"step": 0, "line": 0, "variables": {}, "event": "error", "error": f"SyntaxError: {e}"})
except Exception as e:
    timeline.append({"step": step_counter[0]+1, "line": 0, "variables": {}, "event": "exception", "error": f"{type(e).__name__}: {e}"})
finally:
    sys.settrace(None)

result = {"status": "ok" if timeline and timeline[0].get("event") != "error" else "error", "timeline": timeline, "total_steps": len(timeline)}
print(json.dumps(result))
'''

    # Escape the user code for embedding in the script
    escaped_code = code.replace('"""', '\\"\\"\\"').replace("'''", "\\'\\'\\'")
    full_script = tracer_script.replace("{user_code}", escaped_code)

    try:
        # Run the tracer script in Docker
        result = subprocess.run(
            ["docker", "run", "--rm", "-i", "vision-ai-python"],
            input=full_script.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout,
        )

        elapsed_ms = int((time.perf_counter() - start_time) * 1000)

        if result.returncode != 0:
            return {
                "status": "error",
                "timeline": [],
                "total_steps": 0,
                "stderr": result.stderr.decode("utf-8", errors="replace"),
                "execution_time_ms": elapsed_ms,
            }

        # Parse JSON output from tracer
        output = result.stdout.decode("utf-8", errors="replace").strip()

        try:
            data = json.loads(output)
            return {
                "status": data.get("status", "ok"),
                "timeline": data.get("timeline", []),
                "total_steps": data.get("total_steps", 0),
                "execution_time_ms": elapsed_ms,
            }
        except json.JSONDecodeError:
            return {
                "status": "error",
                "timeline": [],
                "total_steps": 0,
                "stderr": f"Failed to parse tracer output: {output}",
                "execution_time_ms": elapsed_ms,
            }

    except subprocess.TimeoutExpired:
        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
        return {
            "status": "timeout",
            "timeline": [{
                "step": 0,
                "line": 0,
                "variables": {},
                "event": "error",
                "error": f"Execution timed out after {timeout} seconds"
            }],
            "total_steps": 0,
            "execution_time_ms": elapsed_ms,
        }

    except FileNotFoundError:
        return {
            "status": "error",
            "timeline": [],
            "total_steps": 0,
            "stderr": "Docker is not installed or not in PATH",
            "execution_time_ms": None,
        }

    except Exception as e:
        return {
            "status": "error",
            "timeline": [],
            "total_steps": 0,
            "stderr": str(e),
            "execution_time_ms": None,
        }
