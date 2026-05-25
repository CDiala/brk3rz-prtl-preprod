# Frontend API Guide

**Base URL:** `http://<host>`

---

## Overview

All request and response bodies are encrypted end-to-end using hybrid RSA + AES-256-GCM encryption. No plaintext JSON is ever sent over the wire.

---

## Encryption

### Get Public Key

```
GET /api/secure/publickey
```

Returns the server RSA public key as a PEM string. Fetch once and cache — only changes if the database is wiped.

**Response:**
```json
{
  "publicKey": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
}
```

### Request Encryption

Before sending any request, encrypt the plaintext JSON payload:

1. Generate a random 32-byte AES-256 key
2. Generate a random 12-byte IV and 16-byte nonce
3. Get current Unix timestamp in milliseconds (`ts`)
4. Build AAD = `ts` (8 bytes, big-endian) concatenated with `nonce`
5. Encrypt plaintext JSON with AES-256-GCM using the IV and AAD
6. Wrap the AES key with the server RSA public key using RSA-OAEP-SHA256
7. Send the encrypted payload

**Request body shape (all endpoints):**

```json
{
  "key":   "<base64 — RSA-OAEP-SHA256 wrapped AES key>",
  "data":  "<base64 — iv(12 bytes) || ciphertext || tag(16 bytes)>",
  "nonce": "<base64 — 16-byte random nonce>",
  "ts":    1779290951578
}
```

### Response Decryption

All responses are encrypted with the same AES key from the request session.

**Response body shape:**

```json
{
  "data":  "<base64 encrypted response>",
  "ts":    1779290951578,
  "nonce": "<base64>"
}
```

Decrypt `data` using:
- The same AES key generated for the request
- IV = first 12 bytes of decoded `data`
- Ciphertext = middle bytes
- Tag = last 16 bytes
- AAD = `ts` (8 bytes big-endian) + `nonce`

### Encryption Constraints

| Constraint | Value |
|-----------|-------|
| Timestamp skew allowed | ±60 seconds |
| Nonce reuse | Not allowed (replay protection) |
| Rate limit | 10 requests / minute per IP |

### TypeScript Encryption Helper

```typescript
const toB64 = (buf: ArrayBuffer): string =>
  btoa(Array.from(new Uint8Array(buf), b => String.fromCharCode(b)).join(''));

const fromB64 = (b64: string): Uint8Array =>
  Uint8Array.from(atob(b64), c => c.charCodeAt(0));

export async function encryptRequest(plaintextJson: string, publicKeyPem: string) {
  const enc = new TextEncoder();

  const pemBody = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '');

  const derBuffer = fromB64(pemBody);
  const rsaKey = await crypto.subtle.importKey(
    'spki', derBuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false, ['encrypt']
  );

  const aesKeyRaw = crypto.getRandomValues(new Uint8Array(32));
  const aesKey = await crypto.subtle.importKey(
    'raw', aesKeyRaw, { name: 'AES-GCM' }, false, ['encrypt']
  );

  const iv    = crypto.getRandomValues(new Uint8Array(12));
  const nonce = crypto.getRandomValues(new Uint8Array(16));
  const ts    = Date.now();

  const aad = new Uint8Array(24);
  const view = new DataView(aad.buffer);
  view.setUint32(0, Math.floor(ts / 0x100000000), false);
  view.setUint32(4, ts >>> 0, false);
  aad.set(nonce, 8);

  const ctWithTag = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
    aesKey,
    enc.encode(plaintextJson)
  );

  const ct = new Uint8Array(ctWithTag);
  const data = new Uint8Array(12 + ct.length);
  data.set(iv, 0);
  data.set(ct, 12);

  const wrappedKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaKey, aesKeyRaw);

  return {
    payload: {
      key:   toB64(wrappedKey),
      data:  toB64(data.buffer),
      nonce: toB64(nonce.buffer),
      ts,
    },
    aesKeyRaw,
    nonce,
    ts,
  };
}

export async function decryptResponse(
  responseData: string,
  responseTs: number,
  responseNonce: string,
  aesKeyRaw: Uint8Array
): Promise<string> {
  const aesKey = await crypto.subtle.importKey(
    'raw', aesKeyRaw, { name: 'AES-GCM' }, false, ['decrypt']
  );

  const raw = fromB64(responseData);
  const iv         = raw.slice(0, 12);
  const ciphertext = raw.slice(12);

  const nonce = fromB64(responseNonce);
  const aad   = new Uint8Array(24);
  const view  = new DataView(aad.buffer);
  view.setUint32(0, Math.floor(responseTs / 0x100000000), false);
  view.setUint32(4, responseTs >>> 0, false);
  aad.set(nonce, 8);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
    aesKey,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}
```

### Usage Pattern

```typescript
// 1. Fetch and cache public key once
const { publicKey } = await fetch('/api/secure/publickey').then(r => r.json());

// 2. Encrypt and send
const { payload, aesKeyRaw, ts, nonce } = await encryptRequest(
  JSON.stringify({ email: 'broker@example.com', password: 'MyPassword1!' }),
  publicKey
);

const res = await fetch('/api/broker-auth/login', {
  method: 'POST',
  credentials: 'include',          // required — sends/receives cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

// 3. Decrypt response
const encrypted = await res.json();
const json = await decryptResponse(encrypted.data, encrypted.ts, encrypted.nonce, aesKeyRaw);
const result = JSON.parse(json);
```

---

## Required Headers

```
Content-Type: application/json
Origin: <your frontend origin>
```

`credentials: 'include'` must be set on every fetch call — cookies are HttpOnly and attached automatically by the browser.

---

## Cookie Reference

| Cookie | Lifetime | HttpOnly | Secure | SameSite |
|--------|----------|----------|--------|----------|
| `broker_access_token` | 10 min | Yes | Prod only | Strict |
| `broker_refresh_token` | 60 min | Yes | Prod only | Strict |
| `staff_access_token` | 10 min | Yes | Prod only | Strict |
| `staff_refresh_token` | 60 min | Yes | Prod only | Strict |

Cookies are set automatically on login and refresh. The frontend does not handle them — the browser attaches them to subsequent requests automatically.

---

## Password Policy

Applies to broker passwords only.

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

---

---

# Broker Auth

**Base URL:** `http://<host>/api/broker-auth`

## Standard Flow

```
1. Admin creates broker record in DB with a default password
2. Broker calls POST /register with default + new password
3. Broker calls POST /login  →  cookies issued
4. Broker calls POST /me     →  profile returned
5. Access token nears expiry
6. Broker calls POST /refresh  →  new cookies issued
7. Broker calls POST /logout   →  session ended, cookies cleared
```

## Password Reset Flow

```
1. Broker calls POST /send-reset-password-email
2. OTP arrives in broker's email (valid 15 minutes)
3. Broker calls POST /reset-password with OTP + new password
4. Broker calls POST /login with new password
```

---

### POST /api/broker-auth/register

Activates a broker account. Admin pre-creates the broker record with a default password. The broker calls this endpoint to set their own password.

**Authentication:** None required

**Plaintext payload:**

```json
{
  "email": "broker@example.com",
  "defaultPassword": "AdminSetPassword1!",
  "newPassword": "MyPassword1!",
  "confirmNewPassword": "MyPassword1!"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Must match email on pre-created broker record |
| `defaultPassword` | string | Yes | Password set by admin |
| `newPassword` | string | Yes | Must pass password policy |
| `confirmNewPassword` | string | Yes | Must match `newPassword` |

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ "message": "Registration successful." }` |
| 400 | `{ "message": "Passwords do not match." }` |
| 400 | `{ "message": "<password policy violation>" }` |
| 401 | `{ "message": "Invalid credentials or account already registered." }` |

---

### POST /api/broker-auth/login

Authenticates a broker. Only succeeds after registration is complete.

**Authentication:** None required

**Plaintext payload:**

```json
{
  "email": "broker@example.com",
  "password": "MyPassword1!"
}
```

**On success:** Sets `broker_access_token` and `broker_refresh_token` cookies.

**Success response plaintext:**

```json
{
  "userId": "ebc7308a7aff475999b584410e7a4919",
  "accessExpiresAt": "2026-05-21T10:30:00+00:00",
  "refreshExpiresAt": "2026-05-21T11:20:00+00:00"
}
```

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ userId, accessExpiresAt, refreshExpiresAt }` |
| 401 | `{ "message": "Invalid email or password." }` |
| 401 | `{ "message": "Account not yet activated. Please complete registration first." }` |

---

### POST /api/broker-auth/me

Returns the authenticated broker's profile.

**Authentication:** Required — `broker_access_token` cookie

**Plaintext payload:** `{}`

**Success response plaintext:**

```json
{
  "id": "ebc7308a-7aff-4759-99b5-84410e7a4919",
  "companyName": "Test Broker Ltd",
  "registrationNumber": "RC12345",
  "userName": "testbroker",
  "emailAddress": "broker@example.com",
  "address": "1 Test Street",
  "state": "Lagos",
  "lga": "Ikeja",
  "directorName": "John Doe",
  "contactNumbers": "08012345678",
  "tin": "TIN12345"
}
```

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | broker profile object |
| 401 | `{ "message": "Invalid token." }` |
| 404 | `{ "message": "Broker not found." }` |

---

### POST /api/broker-auth/refresh

Issues new access and refresh tokens. Call before access token expires.

**Authentication:** Required — `broker_refresh_token` cookie

**Plaintext payload:** `{}`

On success, old refresh token is invalidated and both cookies are replaced.

**Success response plaintext:**

```json
{
  "userId": "ebc7308a7aff475999b584410e7a4919",
  "accessExpiresAt": "2026-05-21T10:40:00+00:00",
  "refreshExpiresAt": "2026-05-21T11:30:00+00:00"
}
```

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ userId, accessExpiresAt, refreshExpiresAt }` |
| 401 | `{ "message": "Missing refresh token." }` |
| 401 | `{ "message": "Invalid refresh token." }` — cookies cleared |

---

### POST /api/broker-auth/logout

Ends the broker session. Revokes refresh token and clears both cookies.

**Authentication:** Required — `broker_refresh_token` cookie

**Plaintext payload:** `{}`

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ "message": "Logged out." }` |

---

### POST /api/broker-auth/send-reset-password-email

Sends a password reset OTP to the broker's registered email. Always returns 202 regardless of whether the email exists.

**Authentication:** None required

**Plaintext payload:**

```json
{
  "email": "broker@example.com"
}
```

OTP expires in **15 minutes**.

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 202 | `{ "message": "If that email exists, a reset code has been sent." }` |

---

### POST /api/broker-auth/reset-password

Resets broker password using the OTP received by email.

**Authentication:** None required

**Plaintext payload:**

```json
{
  "email": "broker@example.com",
  "otp": "123456",
  "newPassword": "MyNewPassword1!",
  "confirmNewPassword": "MyNewPassword1!"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | |
| `otp` | string | Yes | Code from reset email, max 16 chars |
| `newPassword` | string | Yes | Must pass password policy |
| `confirmNewPassword` | string | Yes | Must match `newPassword` |

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ "message": "Password reset successful." }` |
| 400 | `{ "message": "Passwords do not match." }` |
| 400 | `{ "message": "Invalid or expired code." }` |
| 400 | `{ "message": "<password policy violation>" }` |

---

---

# Staff Auth

**Base URL:** `http://<host>/api/staff-auth`

Staff accounts are pre-created by admin. Authentication is delegated to an internal identity provider — the backend forwards credentials and issues JWT cookies on success.

## Standard Flow

```
1. Admin creates staff record in DB
2. Staff calls POST /login with username + pin  →  cookies issued
3. Staff calls POST /me  →  profile returned
4. Access token nears expiry
5. Staff calls POST /refresh  →  new cookies issued
6. Staff calls POST /logout  →  session ended, cookies cleared
```

---

### POST /api/staff-auth/login

Authenticates a staff member via the internal identity provider.

**Authentication:** None required

**Plaintext payload:**

```json
{
  "username": "joseph.adewunmi",
  "pin": "4545"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `username` | string | Yes | Staff name as stored in DB |
| `pin` | string | Yes | PIN/OTP from internal auth system |

**On success:** Sets `staff_access_token` and `staff_refresh_token` cookies.

**Success response plaintext:**

```json
{
  "userId": "abc123...",
  "accessExpiresAt": "2026-05-21T10:30:00+00:00",
  "refreshExpiresAt": "2026-05-21T11:20:00+00:00"
}
```

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ userId, accessExpiresAt, refreshExpiresAt }` |
| 401 | `{ "message": "Invalid credentials or account is inactive." }` |

---

### POST /api/staff-auth/me

Returns the authenticated staff member's profile.

**Authentication:** Required — `staff_access_token` cookie

**Plaintext payload:** `{}`

**Success response plaintext:**

```json
{
  "id": "abc123...",
  "name": "joseph.adewunmi",
  "staffId": "joseph.adewunmi",
  "emailAddress": "joseph.adewunmi@company.com",
  "role": "staff",
  "department": "IT",
  "branch": "Head Office",
  "active": true,
  "lastLoginAt": "2026-05-21T10:20:00Z",
  "lastLoginIp": "192.168.1.1"
}
```

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | staff profile object |
| 401 | `{ "message": "Invalid token." }` |
| 404 | `{ "message": "Staff not found." }` |

---

### POST /api/staff-auth/refresh

Issues new access and refresh tokens.

**Authentication:** Required — `staff_refresh_token` cookie

**Plaintext payload:** `{}`

On success, old refresh token is invalidated and both cookies are replaced.

**Success response plaintext:**

```json
{
  "userId": "abc123...",
  "accessExpiresAt": "2026-05-21T10:40:00+00:00",
  "refreshExpiresAt": "2026-05-21T11:30:00+00:00"
}
```

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ userId, accessExpiresAt, refreshExpiresAt }` |
| 401 | `{ "message": "Missing refresh token." }` |
| 401 | `{ "message": "Invalid refresh token." }` — cookies cleared |

---

### POST /api/staff-auth/logout

Ends the staff session. Revokes refresh token and clears both cookies.

**Authentication:** Required — `staff_refresh_token` cookie

**Plaintext payload:** `{}`

**Responses:**

| Status | Plaintext body |
|--------|----------------|
| 200 | `{ "message": "Logged out." }` |

---

## Error Handling

All error responses follow the same shape after decryption:

```json
{ "message": "Human-readable error description." }
```

HTTP 400 — bad request / validation failure  
HTTP 401 — authentication failure  
HTTP 404 — resource not found  
HTTP 429 — rate limit exceeded (10 req/min per IP)  
HTTP 500 — unexpected server error

---

## Session Management Recommendation

Store `accessExpiresAt` and `refreshExpiresAt` from login/refresh response. Before any authenticated request:

```typescript
const BUFFER_MS = 60_000; // refresh 1 minute before expiry

if (Date.now() > new Date(accessExpiresAt).getTime() - BUFFER_MS) {
  await callRefresh(); // updates cookies + expiry times
}
```

If refresh returns 401, session is expired — redirect to login.
