#!/usr/bin/env python
"""Complete end-to-end test for career job application"""
import json
import time
from datetime import datetime

# Test user credentials
TEST_EMAIL = f"test_career_{int(time.time())}@example.com"
TEST_PHONE = f"555{int(time.time()) % 10000:04d}"
TEST_FULL_NAME = "Test Career User"
TEST_PASSWORD = "testpass123"

print("=" * 80)
print("CAREER APPLICATION E2E TEST")
print("=" * 80)
print(f"Test started at: {datetime.now().isoformat()}")
print(f"Test user: {TEST_EMAIL}")
print()

# Step 1: Register user
print("STEP 1: Register user")
print("-" * 80)

import urllib.request
import urllib.error

def make_request(method, url, data=None, headers=None):
    """Make HTTP request and return response"""
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
    except Exception as e:
        print(f"ERROR: {e}")
        return None, str(e)

# Register
register_data = {
    "email": TEST_EMAIL,
    "phone": TEST_PHONE,
    "full_name": TEST_FULL_NAME,
    "password": TEST_PASSWORD
}
status, response = make_request("POST", "http://localhost:8000/auth/register", register_data)
print(f"Status: {status}")
print(f"Response: {response}")
if status == 200:
    print("[OK] Register successful")
else:
    print("[FAIL] Register failed")
print()

# Step 2: Login
print("STEP 2: Login")
print("-" * 80)

login_data = f"username={TEST_EMAIL}&password={TEST_PASSWORD}"
headers = {'Content-Type': 'application/x-www-form-urlencoded'}
status, response = make_request("POST", "http://localhost:8000/auth/login", 
                               login_data.encode('utf-8'), headers)
print(f"Status: {status}")
print(f"Response: {response}")

token = None
if status == 200:
    try:
        token_response = json.loads(response)
        token = token_response.get("access_token")
        print(f"[OK] Login successful")
        print(f"Token: {token[:50]}...")
    except:
        print("[FAIL] Failed to parse token")
else:
    print("[FAIL] Login failed")
print()

if not token:
    print("Cannot continue without token")
    exit(1)

# Step 3: Get user info to verify auth works
print("STEP 3: Verify authentication - GET /auth/me")
print("-" * 80)

headers = {'Authorization': f'Bearer {token}'}
status, response = make_request("GET", "http://localhost:8000/auth/me", headers=headers)
print(f"Status: {status}")
print(f"Response: {response}")
if status == 200:
    print("[OK] Auth verification successful")
else:
    print("[FAIL] Auth verification failed")
print()

# Step 4: Create job application
print("STEP 4: Create job application - POST /career/applications")
print("-" * 80)

app_data = {
    "company": "Google",
    "position": "Senior Software Engineer",
    "status": "Applied",
    "salary_range": "200k-250k",
    "notes": "Exciting opportunity in AI team"
}
print(f"Request payload: {json.dumps(app_data, indent=2)}")
print()

headers = {'Authorization': f'Bearer {token}'}
status, response = make_request("POST", "http://localhost:8000/career/applications", app_data, headers)
print(f"Status: {status}")
print(f"Response: {response}")

if status == 200:
    try:
        app_response = json.loads(response)
        print("[OK] Job application created successfully")
        print(f"Application ID: {app_response.get('id')}")
        print(f"Applied Date: {app_response.get('applied_date')}")
        print(f"Updated At: {app_response.get('updated_at')}")
    except:
        print("[FAIL] Failed to parse response")
else:
    print("[FAIL] Failed to create job application")
    print()
    # Try to parse error
    try:
        error_response = json.loads(response)
        print(f"Error details: {json.dumps(error_response, indent=2)}")
    except:
        print(f"Error response (raw): {response}")
print()

# Step 5: Get all applications
print("STEP 5: Get all job applications - GET /career/applications")
print("-" * 80)

headers = {'Authorization': f'Bearer {token}'}
status, response = make_request("GET", "http://localhost:8000/career/applications", headers=headers)
print(f"Status: {status}")
print(f"Response: {response}")
if status == 200:
    try:
        apps = json.loads(response)
        print(f"[OK] Retrieved {len(apps)} applications")
        if apps:
            print(f"First application: {json.dumps(apps[0], indent=2)}")
    except:
        print("[FAIL] Failed to parse response")
else:
    print("[FAIL] Failed to get applications")

print()
print("=" * 80)
print("TEST COMPLETED")
print("=" * 80)
