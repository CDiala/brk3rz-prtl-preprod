# Auth Components: Endpoints and Payloads

This file maps each form in `libs/auth` components to a suggested backend endpoint and the exact payload shape (confirmed from component code).

- File: libs/auth/src/lib/components/login/login.html
  - Endpoint: `POST /auth/login` (implemented as `endpoints.UserManagementAPI.login`)
  - Payload (type: `AuthRequest`):
    ```json
    { "username": "user@example.com", "password": "plaintextPassword" }
    ```
  - Notes: The component builds `credentials: AuthRequest` from controls `email` and `password` and dispatches `loginUser` action.

- File: libs/auth/src/lib/components/identify-user/identify-user.html
  - Endpoint: `POST /auth/password-reset/request` (service uses `sendResetLink` query param)
  - Payload (as sent to store action):
    ```json
    { "email": "user@example.com" }
    ```
  - Notes: Component dispatches `sendResetLink({ email })` which the effect calls `authService.sendResetLink(email)` (GET with `emailAddress` query param).

- File: libs/auth/src/lib/components/otp/otp.html
  - Endpoint: `POST /auth/verify-otp` (suggested)
  - Payload:
    ```json
    { "email": "user@example.com", "code": "123456" }
    ```
  - Notes: `lib-otp` is a ControlValueAccessor that emits the full 6-digit code via `otpComplete` output; parent components should call the verification endpoint with the concatenated code.

- File: libs/auth/src/lib/components/signup/signup.html
  - If used for registration:
    - Endpoint: `POST /auth/register`
    - Payload:
      ```json
      { "username": "john.doe", "password": "initialPassword" }
      ```
  - If used for password reset/confirm (route contains `reset`):
    - Endpoint: `POST /auth/password-reset/confirm` (implemented as `endpoints.UserManagementAPI.resetPassword`)
    - Payload (type: `UpdatePasswordRequest`):
      ```json
      { "username": "user@example.com", "otp": "tokenValue", "password": "newSecret" }
      ```
  - Notes: Component constructs `UpdatePasswordRequest` from controls `username`, `token`, `newPassword` and dispatches `updatePassword` action with `isRegister` flag.

- File: libs/auth/src/lib/components/password-reset-sent/password-reset-sent.html
  - No form; actions:
    - Resend endpoint: `POST /auth/password-reset/resend` (suggested)
    - Payload:
      ```json
      { "email": "user@example.com" }
      ```
  - Notes: The component reads the email from `AuthFacade.passwordResetLinkInfo$` and provides a `handleResend()` UI hook — connect this to `sendResetLink` action or a dedicated resend API.

---

If you want, I can:

- generate a CSV/JSON file with these mappings,
- update the components to call the service actions directly for resend/verify flows, or
- create typed API client wrappers using the actual `getApiEndpoints` values.
