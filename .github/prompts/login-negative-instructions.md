# Login Negative Test Cases (Validation)

---

## 🧪 Test Cases

### TC-NEG-001: Empty email and password

**Steps:**

1. Open login page
2. Leave email empty
3. Leave password empty
4. Click login

**Expected:**

- Error message for required fields
- User is not logged in

---

### TC-NEG-002: Empty email

**Steps:**

1. Enter password
2. Leave email empty
3. Click login

**Expected:**

- Email required error shown

---

### TC-NEG-003: Empty password

**Steps:**

1. Enter email
2. Leave password empty
3. Click login

**Expected:**

- Password required error shown

---

### TC-NEG-004: Invalid email format (no @)

**Steps:**

1. Enter email: `test.com`
2. Enter password
3. Click login

**Expected:**

- Email format validation error

---

### TC-NEG-005: Invalid email format (no domain)

**Steps:**

1. Enter email: `test@`
2. Enter password
3. Click login

**Expected:**

- Email format validation error

---

### TC-NEG-006: Email with spaces

**Steps:**

1. Enter email: `test@test.com`
2. Enter password
3. Click login

**Expected:**

- Either trimmed and accepted OR validation error (depending on requirements)

---

### TC-NEG-007: Incorrect password

**Steps:**

1. Enter valid email
2. Enter wrong password
3. Click login

**Expected:**

- Error: invalid credentials

---

### TC-NEG-008: Non-existing user

**Steps:**

1. Enter email that does not exist
2. Enter any password
3. Click login

**Expected:**

- Error: user not found OR generic error

---

### TC-NEG-009: SQL Injection attempt

**Steps:**

1. Enter email: `' OR 1=1`
2. Enter password: `' OR 1=1`
3. Click login

**Expected:**

- Login fails
- No system crash
- No unauthorized access

---

### TC-NEG-010: XSS attempt

**Steps:**

1. Enter email: `<script>alert(1)</script>`
2. Enter password
3. Click login

**Expected:**

- Input is sanitized
- No script execution

---

### TC-NEG-011: Very long input

**Steps:**

1. Enter email with 1000+ characters
2. Enter password
3. Click login

**Expected:**

- Input rejected OR safely handled
- No UI break

---
