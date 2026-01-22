#!/usr/bin/env python
"""
Quick verification script for Career Module
Run this to verify the Career module is working correctly
"""
import json
import urllib.request
import urllib.error
import sys

def test_career_module():
    """Test the career module with a complete workflow"""
    
    print("\n" + "=" * 70)
    print("CAREER MODULE VERIFICATION")
    print("=" * 70)
    
    BASE_URL = "http://localhost:8000"
    TEST_EMAIL = "verify_test@example.com"
    TEST_PASSWORD = "verify123"
    
    try:
        print("\n[1/4] Registering test user...", end="", flush=True)
        req = urllib.request.Request(
            f"{BASE_URL}/auth/register",
            data=json.dumps({
                "email": TEST_EMAIL,
                "phone": "5551111",
                "full_name": "Verify Test",
                "password": TEST_PASSWORD
            }).encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        resp = urllib.request.urlopen(req)
        print(" ✓")
        
        print("[2/4] Logging in...", end="", flush=True)
        req = urllib.request.Request(
            f"{BASE_URL}/auth/login",
            data=f"username={TEST_EMAIL}&password={TEST_PASSWORD}".encode(),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        resp = urllib.request.urlopen(req)
        token = json.loads(resp.read()).get("access_token")
        print(" ✓")
        
        print("[3/4] Creating job application...", end="", flush=True)
        req = urllib.request.Request(
            f"{BASE_URL}/career/applications",
            data=json.dumps({
                "company": "Test Company",
                "position": "Test Position",
                "status": "Applied",
                "salary_range": "100k-150k",
                "notes": "Test application"
            }).encode(),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            method="POST"
        )
        resp = urllib.request.urlopen(req)
        app = json.loads(resp.read())
        
        # Verify response has required fields
        required_fields = ["id", "company", "position", "status", "applied_date", "updated_at"]
        missing = [f for f in required_fields if f not in app]
        
        if missing:
            print(f" ✗\n  Missing fields: {missing}")
            return False
        print(" ✓")
        
        print("[4/4] Retrieving applications...", end="", flush=True)
        req = urllib.request.Request(
            f"{BASE_URL}/career/applications",
            headers={"Authorization": f"Bearer {token}"},
            method="GET"
        )
        resp = urllib.request.urlopen(req)
        apps = json.loads(resp.read())
        
        if not isinstance(apps, list) or len(apps) == 0:
            print(f" ✗\n  No applications retrieved")
            return False
        print(" ✓")
        
        print("\n" + "=" * 70)
        print("✓ Career module is working correctly!")
        print("=" * 70)
        print(f"\nApplication created:")
        print(f"  - ID: {app['id']}")
        print(f"  - Company: {app['company']}")
        print(f"  - Position: {app['position']}")
        print(f"  - Status: {app['status']}")
        print(f"  - Applied: {app['applied_date']}")
        print(f"  - Updated: {app['updated_at']}")
        print("\nYou can now use the Career module at http://localhost:3000/portal/career")
        print("=" * 70 + "\n")
        return True
        
    except urllib.error.HTTPError as e:
        print(f" ✗\n\nHTTP Error {e.code}: {e.read().decode()[:200]}")
        return False
    except ConnectionRefusedError:
        print(" ✗\n\nError: Cannot connect to server at http://localhost:8000")
        print("Make sure the backend server is running:")
        print("  python -m uvicorn server.main:app --reload --host 127.0.0.1 --port 8000")
        return False
    except Exception as e:
        print(f" ✗\n\nError: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_career_module()
    sys.exit(0 if success else 1)
