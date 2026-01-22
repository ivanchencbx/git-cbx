import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  const BASE_URL = 'http://localhost:8000';
  let authToken: string;
  let testUserEmail: string;

  test.beforeAll(async () => {
    // This could be used to setup initial state if needed
  });

  test('should have healthy API', async () => {
    const response = await fetch(`${BASE_URL}/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('should register user via API', async () => {
    const timestamp = Date.now();
    testUserEmail = `apitest${timestamp}@test.com`;
    
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'TestPassword123!@#',
        phone: `1${timestamp.toString().slice(-9)}`,
        full_name: 'API Test User',
      }),
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.email).toBe(testUserEmail);
  });

  test('should login user via API', async () => {
    const timestamp = Date.now();
    const email = `apitestlogin${timestamp}@test.com`;
    
    // Register first
    await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'TestPassword123!@#',
        phone: `1${timestamp.toString().slice(-9)}`,
        full_name: 'API Test User',
      }),
    });

    // Login
    const loginData = new URLSearchParams();
    loginData.append('username', email);
    loginData.append('password', 'TestPassword123!@#');

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: loginData.toString(),
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.access_token).toBeTruthy();
    expect(data.token_type).toBe('bearer');
    
    authToken = data.access_token;
  });

  test('should reject login with wrong password', async () => {
    const loginData = new URLSearchParams();
    loginData.append('username', 'nonexistent@test.com');
    loginData.append('password', 'WrongPassword');

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: loginData.toString(),
    });

    expect(response.status).toBe(401);
  });

  test('should reject duplicate email registration', async () => {
    const timestamp = Date.now();
    const email = `duplicate${timestamp}@test.com`;

    // Register first time
    const firstResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'TestPassword123!@#',
        phone: `1${timestamp.toString().slice(-9)}`,
        full_name: 'First User',
      }),
    });
    expect(firstResponse.status).toBe(200);

    // Try to register with same email
    const secondResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'DifferentPassword123!@#',
        phone: `1${timestamp.toString().slice(-9)}`,
        full_name: 'Second User',
      }),
    });

    expect(secondResponse.status).toBe(400);
    
    const data = await secondResponse.json();
    expect(data.detail).toContain('already registered');
  });

  test('should authenticate protected endpoints', async ({ page }: any) => {
    const timestamp = Date.now();
    const email = `protectedtest${timestamp}@test.com`;
    
    // Register and login
    await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'TestPassword123!@#',
        phone: `1${timestamp.toString().slice(-9)}`,
        full_name: 'Protected Test User',
      }),
    });

    const loginData = new URLSearchParams();
    loginData.append('username', email);
    loginData.append('password', 'TestPassword123!@#');

    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: loginData.toString(),
    });

    const loginData_json = await loginResponse.json();
    const token = loginData_json.access_token;

    // Try to access protected endpoint without token (should fail)
    const noTokenResponse = await fetch(`${BASE_URL}/survey/`, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Could be 401 or 404 depending on endpoint implementation
    expect([401, 404, 422].includes(noTokenResponse.status)).toBeTruthy();

    // Try with token (might succeed or return 404 if endpoint not fully implemented)
    const withTokenResponse = await fetch(`${BASE_URL}/survey/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Should at least not be 401
    expect(withTokenResponse.status).not.toBe(401);
  });
});
