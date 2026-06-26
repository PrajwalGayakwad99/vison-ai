"""
Visual Tracer Script
====================
Self-contained tracer that runs user code with step-by-step visual tracking.
This script is injected into the Docker container alongside user code.

Usage:
    python tracer_script.py "<user_code>"
"""

import sys
import json


# ─────────────────────────────────────────────────────────────────────────────
# TRACER IMPLEMENTATION
# ─────────────────────────────────────────────────────────────────────────────

def create_tracer(timeline):
    """
    Create a trace function that captures execution state.
    """
    step_counter = [0]  # Mutable container for step count
    stdout_buffer = []

    def trace_func(frame, event, arg):
        if event == "line":
            step_counter[0] += 1

            # Capture local variables, filtering out internals
            local_vars = {}
            try:
                for key, value in frame.f_locals.items():
                    # Filter out internal Python variables
                    if not key.startswith("__") and key not in ("_tracer", "trace_func", "timeline"):
                        try:
                            # Truncate long values
                            repr_val = repr(value)
                            if len(repr_val) > 200:
                                repr_val = repr_val[:200] + "..."
                            local_vars[key] = repr_val
                        except Exception:
                            local_vars[key] = f"<{type(value).__name__}>"
            except (ValueError, TypeError):
                pass

            timeline.append({
                "step": step_counter[0],
                "line": frame.f_lineno,
                "variables": local_vars,
                "output": "".join(stdout_buffer) if stdout_buffer else None,
                "event": "line",
            })

        elif event == "call":
            step_counter[0] += 1
            timeline.append({
                "step": step_counter[0],
                "line": frame.f_lineno,
                "variables": {},
                "output": None,
                "event": "call",
            })

        elif event == "return":
            step_counter[0] += 1
            timeline.append({
                "step": step_counter[0],
                "line": frame.f_lineno,
                "variables": {"__return__": repr(arg) if arg is not None else "None"},
                "output": None,
                "event": "return",
            })

        return trace_func

    return trace_func


def run_with_trace(code: str, max_steps: int = 1000) -> dict:
    """
    Execute code with visual tracing and return the timeline.

    Args:
        code: Python source code to trace
        max_steps: Maximum steps to capture (prevents infinite loops)

    Returns:
        dict with status, timeline, total_steps
    """
    timeline = []
    step_counter = [0]

    # Compile the user code
    try:
        compiled = compile(code, "<user_code>", "exec")
    except SyntaxError as e:
        return {
            "status": "syntax_error",
            "timeline": [{
                "step": 0,
                "line": 0,
                "variables": {},
                "output": None,
                "event": "error",
                "error": f"SyntaxError: {e}",
            }],
            "total_steps": 0,
        }

    # Create trace function with step limiting
    def trace_func(frame, event, arg):
        if step_counter[0] >= max_steps:
            timeline.append({
                "step": step_counter[0] + 1,
                "line": frame.f_lineno,
                "variables": {},
                "output": None,
                "event": "error",
                "error": f"Execution stopped after {max_steps} steps (possible infinite loop detected)",
            })
            return None  # Stop tracing

        if event == "line":
            step_counter[0] += 1

            # Capture local variables
            local_vars = {}
            try:
                for key, value in frame.f_locals.items():
                    if not key.startswith("__"):
                        try:
                            repr_val = repr(value)
                            if len(repr_val) > 200:
                                repr_val = repr_val[:200] + "..."
                            local_vars[key] = repr_val
                        except Exception:
                            local_vars[key] = f"<{type(value).__name__}>"
            except (ValueError, TypeError):
                pass

            timeline.append({
                "step": step_counter[0],
                "line": frame.f_lineno,
                "variables": local_vars,
                "output": None,
                "event": "line",
            })

        elif event == "call":
            step_counter[0] += 1
            timeline.append({
                "step": step_counter[0],
                "line": frame.f_lineno,
                "variables": {},
                "output": None,
                "event": "call",
            })

        elif event == "return":
            step_counter[0] += 1
            timeline.append({
                "step": step_counter[0],
                "line": frame.f_lineno,
                "variables": {"__return__": repr(arg) if arg is not None else "None"},
                "output": None,
                "event": "return",
            })

        return trace_func

    # Execute with tracing
    namespace = {
        "__name__": "__main__",
        "__builtins__": __builtins__,
    }

    try:
        sys.settrace(trace_func)
        exec(compiled, namespace)
    except Exception as e:
        timeline.append({
            "step": step_counter[0] + 1,
            "line": 0,
            "variables": {},
            "output": None,
            "event": "exception",
            "error": f"{type(e).__name__}: {e}",
        })
    finally:
        sys.settrace(None)

    return {
        "status": "ok",
        "timeline": timeline,
        "total_steps": len(timeline),
    }


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Read code from stdin or command line argument
    if len(sys.argv) > 1:
        code = sys.argv[1]
    else:
        code = sys.stdin.read()

    result = run_with_trace(code)

    # Output as JSON
    print(json.dumps(result))
