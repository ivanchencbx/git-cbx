#!/usr/bin/env python
"""Start backend server and capture all output"""
import subprocess
import sys
import time

print("Starting FastAPI server...")
print("=" * 80)

# Start the server
process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "server.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd=r"C:\Users\ThinkPad\git-cbx"
)

# Wait a moment for server to start
time.sleep(3)

# Run the test in a separate process
print("\nRunning test in 2 seconds...")
print("=" * 80)
time.sleep(2)

test_process = subprocess.Popen(
    [sys.executable, "test_career_e2e.py"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd=r"C:\Users\ThinkPad\git-cbx"
)

# Collect server output while test runs
print("\n[SERVER LOG]:")
print("=" * 80)

# Read server output
import threading
def read_server_output():
    for line in process.stdout:
        print(f"SERVER: {line.rstrip()}")

server_thread = threading.Thread(target=read_server_output, daemon=True)
server_thread.start()

# Wait for test to complete
test_stdout, _ = test_process.communicate()
print("\n[TEST OUTPUT]:")
print("=" * 80)
print(test_stdout)

print("\n[WAITING FOR SERVER OUTPUT]:")
print("=" * 80)
time.sleep(2)

# Terminate server
process.terminate()
try:
    process.wait(timeout=2)
except subprocess.TimeoutExpired:
    process.kill()
