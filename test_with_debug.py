#!/usr/bin/env python
"""Run server and capture detailed error output"""
import subprocess
import sys
import time
import os

print("Killing existing Python processes...")
os.system("taskkill /F /IM python.exe 2>nul")
time.sleep(1)

print("\nStarting server with detailed logging...")
print("=" * 80)

# Start server WITHOUT reload to see all errors clearly
cmd = [
    sys.executable, "-m", "uvicorn",
    "server.main:app",
    "--host", "127.0.0.1",
    "--port", "8000",
    "--log-level", "debug"
]

process = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    universal_newlines=True,
    bufsize=1,
    cwd=r"C:\Users\ThinkPad\git-cbx"
)

time.sleep(2)

print("\nSending test request...")
print("=" * 80)

# Make a simple test request to trigger the error
import urllib.request
import json

def make_request(method, url, data=None, headers=None):
    if headers is None:
        headers = {}
    if data is not None and not isinstance(data, bytes):
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            body = response.read().decode('utf-8')
            return response.status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return e.code, body

# Register and login first
print("1. Register user...")
reg_resp = make_request("POST", "http://localhost:8000/auth/register", {
    "email": "debug_test@example.com",
    "phone": "5551234",
    "full_name": "Debug User",
    "password": "password123"
})
print(f"Register: {reg_resp[0]}\n")

print("2. Login...")
login_data = "username=debug_test@example.com&password=password123"
login_resp = make_request("POST", "http://localhost:8000/auth/login", 
                         login_data.encode('utf-8'),
                         {'Content-Type': 'application/x-www-form-urlencoded'})
print(f"Login: {login_resp[0]}")
token = json.loads(login_resp[1]).get("access_token") if login_resp[0] == 200 else None
print(f"Token: {token[:30] if token else 'NONE'}...\n")

if token:
    print("3. Create job application...")
    headers = {'Authorization': f'Bearer {token}'}
    resp = make_request("POST", "http://localhost:8000/career/applications", {
        "company": "Test Corp",
        "position": "Engineer",
        "status": "Applied",
        "salary_range": "100k",
        "notes": "Test"
    }, headers)
    print(f"Status: {resp[0]}")
    print(f"Response: {resp[1][:500]}\n")

# Give server time to process and print logs
time.sleep(2)

# Terminate and read remaining output
process.terminate()
remaining_output = ""
try:
    for line in iter(process.stdout.readline, ''):
        if line:
            remaining_output += line
        else:
            break
except:
    pass

if remaining_output:
    print("\nServer output during test:")
    print("=" * 80)
    print(remaining_output)
    
try:
    process.wait(timeout=1)
except:
    process.kill()
