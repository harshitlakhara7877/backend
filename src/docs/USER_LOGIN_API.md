# User Login API

## Endpoint

```http
POST /api/users/login
```

## Request

```json
{
  "email": "harshit@example.com",
  "password": "123456"
}
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Harshit",
    "email": "harshit@example.com",
    "role": "passenger"
  }
}
```

## Invalid Login

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Protected Routes

Send the token in the request header:

```http
Authorization: Bearer JWT_TOKEN
```