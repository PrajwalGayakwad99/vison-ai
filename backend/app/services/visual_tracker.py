"""
Visual Code Execution Tracker
=============================
A step-by-step execution tracer that instruments Python code using sys.settrace.
Captures line numbers, variable mutations, and call stack for visual debugging.

Author: Vision AI Backend Team
"""

from __future__ import annotations

import sys
import io
import traceback
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ExecutionStep:
    """Represents a single step in the execution timeline."""
    step: int
    line: int
    variables: dict[str, Any]
    call_stack: list[str]
    event: str = "line"  # "line", "call", "return", "exception"

    def to_dict(self) -> dict:
        """Convert to serializable dictionary."""
        # Sanitize variables for JSON serialization
        safe_vars = {}
        for k, v in self.variables.items():
            try:
                # Truncate long representations
                repr_val = repr(v)
                if len(repr_val) > 100:
                    repr_val = repr_val[:100] + "..."
                safe_vars[k] = repr_val
            except Exception:
                safe_vars[k] = f"<{type(v).__name__}>"

        return {
            "step": self.step,
            "line": self.line,
            "variables": safe_vars,
            "call_stack": self.call_stack,
            "event": self.event,
        }


@dataclass
class TrackerState:
    """Internal state for the execution tracker."""
    step_counter: int = 0
    steps: list[ExecutionStep] = field(default_factory=list)
    current_variables: dict[str, Any] = field(default_factory=dict)
    call_stack: list[str] = field(default_factory=list)
    active_frame: Any = None


class VisualTracker:
    """
    Visual Code Execution Tracker
    -----------------------------
    Uses sys.settrace to instrument Python code execution and capture
    a step-by-step timeline of all state changes.

    Usage:
        tracker = VisualTracker()
        timeline = tracker.execute('''
x = 1
y = 2
z = x + y
''')
        for step in timeline:
            print(step)
    """

    def __init__(self, max_steps: int = 1000, capture_stdout: bool = True):
        """
        Initialize the visual tracker.

        Args:
            max_steps: Maximum number of steps to capture (prevents infinite loops)
            capture_stdout: Whether to capture print() output
        """
        self.max_steps = max_steps
        self.capture_stdout = capture_stdout
        self._state = TrackerState()
        self._old_trace: Any = None
        self._stdout_buffer: io.StringIO | None = None

    def _extract_variables(self, frame) -> dict[str, Any]:
        """Extract local and global variables from a stack frame."""
        variables = {}

        # Get local variables
        try:
            variables.update(frame.f_locals)
        except (ValueError, TypeError):
            pass

        # Get global variables (filter to avoid builtin noise)
        try:
            for key, value in frame.f_globals.items():
                if not key.startswith("__") and key not in variables:
                    variables[key] = value
        except (ValueError, TypeError):
            pass

        return variables

    def _simplify_call_stack(self, frame) -> list[str]:
        """Extract clean function names from the call stack."""
        stack = []
        current = frame
        depth = 0

        while current is not None and depth < 20:  # Limit stack depth
            code = current.f_code
            func_name = code.co_name

            # Skip internal Python functions
            if not func_name.startswith("<"):
                stack.append(func_name)

            current = current.f_back
            depth += 1

        # Ensure "main" is always at the top
        if not stack:
            stack = ["main"]
        elif stack[0] != "main":
            stack.insert(0, "main")

        return stack

    def _trace_callback(
        self,
        frame: Any,
        event: str,
        arg: Any
    ) -> Any:
        """
        The trace function called on every execution event.
        This is the heart of the visual tracker.
        """
        # Safety check for step limit
        if self._state.step_counter >= self.max_steps:
            return self._trace_callback

        try:
            if event == "line":
                self._state.step_counter += 1

                # Extract current variables
                variables = self._extract_variables(frame)

                # Build call stack
                call_stack = self._simplify_call_stack(frame)

                # Create execution step
                step = ExecutionStep(
                    step=self._state.step_counter,
                    line=frame.f_lineno,
                    variables=variables.copy(),
                    call_stack=call_stack.copy(),
                    event="line",
                )
                self._state.steps.append(step)

            elif event == "call":
                # Function entry
                self._state.step_counter += 1
                func_name = frame.f_code.co_name

                step = ExecutionStep(
                    step=self._state.step_counter,
                    line=frame.f_lineno,
                    variables=self._extract_variables(frame).copy(),
                    call_stack=self._simplify_call_stack(frame),
                    event="call",
                )
                self._state.steps.append(step)

            elif event == "return":
                # Function exit
                self._state.step_counter += 1

                step = ExecutionStep(
                    step=self._state.step_counter,
                    line=frame.f_lineno,
                    variables={"__return__": repr(arg) if arg is not None else "None"},
                    call_stack=self._simplify_call_stack(frame),
                    event="return",
                )
                self._state.steps.append(step)

            elif event == "exception":
                # Exception occurred
                exc_type, exc_value, _ = arg
                self._state.step_counter += 1

                step = ExecutionStep(
                    step=self._state.step_counter,
                    line=frame.f_lineno,
                    variables={"__exception__": f"{exc_type.__name__}: {exc_value}"},
                    call_stack=self._simplify_call_stack(frame),
                    event="exception",
                )
                self._state.steps.append(step)

        except Exception:
            # Don't let trace errors break execution
            pass

        return self._trace_callback

    def execute(self, code: str) -> list[dict]:
        """
        Execute Python code with full visual tracking.

        Args:
            code: Python source code as a string

        Returns:
            List of dictionaries representing the execution timeline:
            [
                {"step": 1, "line": 1, "variables": {...}, "call_stack": [...]},
                {"step": 2, "line": 2, "variables": {...}, "call_stack": [...]},
                ...
            ]

        Raises:
            SyntaxError: If the code has invalid Python syntax
            Exception: Any runtime error that occurs during execution
        """
        # Reset state
        self._state = TrackerState()

        # Validate syntax before execution
        try:
            compiled = compile(code, "<visual-tracker>", "exec")
        except SyntaxError as e:
            raise SyntaxError(f"Syntax error in code: {e}")

        # Capture stdout if requested
        stdout_capture = None
        old_stdout = None
        if self.capture_stdout:
            old_stdout = sys.stdout
            stdout_capture = io.StringIO()
            sys.stdout = stdout_capture

        try:
            # Install the tracer
            self._old_trace = sys.gettrace()
            sys.settrace(self._trace_callback)

            # Create isolated namespace for execution
            namespace = {
                "__name__": "__visual_tracker__",
                "__builtins__": __builtins__,
            }

            # Execute the code
            exec(compiled, namespace)

        except Exception as e:
            # Capture the exception but still return the timeline
            self._state.step_counter += 1
            tb_str = traceback.format_exc()

            step = ExecutionStep(
                step=self._state.step_counter,
                line=0,
                variables={"__error__": str(e), "__traceback__": tb_str},
                call_stack=["main"],
                event="exception",
            )
            self._state.steps.append(step)

        finally:
            # Restore everything
            sys.settrace(self._old_trace)
            if self.capture_stdout and old_stdout:
                sys.stdout = old_stdout

        # Convert steps to dictionaries
        return [step.to_dict() for step in self._state.steps]

    def get_timeline(self, code: str) -> list[dict]:
        """
        Alias for execute() - returns the execution timeline.
        """
        return self.execute(code)

    def get_summary(self, code: str) -> dict:
        """
        Get a summary of the execution without the full timeline.

        Returns:
            Dictionary with execution statistics
        """
        timeline = self.execute(code)

        return {
            "total_steps": len(timeline),
            "lines_executed": len(set(s["line"] for s in timeline if s["line"] > 0)),
            "final_variables": timeline[-1]["variables"] if timeline else {},
            "call_stack_depth": max(len(s["call_stack"]) for s in timeline) if timeline else 0,
            "had_exception": any(s["event"] == "exception" for s in timeline),
            "timeline": timeline,
        }


def get_tracker(max_steps: int = 1000) -> VisualTracker:
    """
    Factory function to get a configured VisualTracker instance.

    Args:
        max_steps: Maximum steps to trace (default 1000)

    Returns:
        A new VisualTracker instance
    """
    return VisualTracker(max_steps=max_steps)


# ─────────────────────────────────────────────────────────────────────────────
# Example usage and self-test
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Self-test with sample code
    sample_code = """
def greet(name):
    message = f"Hello, {name}!"
    return message

result = greet("Vision AI")
x = 42
y = x * 2
"""

    tracker = get_tracker()
    timeline = tracker.execute(sample_code)

    print("=" * 60)
    print("VISUAL TRACKER SELF-TEST")
    print("=" * 60)
    print(f"\nTotal steps captured: {len(timeline)}\n")

    for step in timeline:
        print(f"Step {step['step']:3d} | Line {step['line']:3d} | Event: {step['event']}")
        print(f"  Call Stack: {' → '.join(step['call_stack'])}")
        print(f"  Variables: {step['variables']}")
        print()
