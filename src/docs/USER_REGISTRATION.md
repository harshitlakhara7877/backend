# User Registration API

## Endpoint

```http
POST /api/users/register
```

**Base URL**

```text
http://localhost:5000
```

---

## Request Body

```json
{
  "name": "Harshit Lakhara",
  "email": "harshit@example.com",
  "password": "123456",
  "phone": "9876543210",
  "role": "passenger"
}
```

---

## Fields

| Field    | Required | Description                                    |
| -------- | -------- | ---------------------------------------------- |
| name     | ✅        | Minimum 3 characters                           |
| email    | ✅        | Must be unique and valid                       |
| password | ✅        | Minimum 6 characters                           |
| phone    | ❌        | Optional                                       |
| role     | ❌        | `passenger` or `driver` (default: `passenger`) |

---

## Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Harshit Lakhara",
      "email": "harshit@example.com",
      "phone": "9876543210",
      "role": "passenger"
    }
  }
}
```

---

## Validation Error

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    {
      "path": "email",
      "msg": "Please provide a valid email"
    }
  ]
}
```

---

## Duplicate Email

**Status:** `409 Conflict`

```json
{
  "success": false,
  "message": "A user with this email already exists"
}
```

---

## Example (Fetch API)

```javascript
const response = await fetch("http://localhost:5000/api/users/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Harshit",
    email: "harshit@example.com",
    password: "123456",
    role: "passenger"
  })
});

const data = await response.json();
console.log(data);
```
