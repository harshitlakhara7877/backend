# User Profile and Logout API

## Get User Profile

### Endpoint

```http
GET /api/users/profile
```

### Header

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Harshit",
      "email": "harshit@example.com",
      "phone": "9876543210",
      "role": "passenger",
      "accountStatus": "active"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Authorization denied"
}
```

---

## Logout User

### Endpoint

```http
POST /api/users/logout
```

### Header

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

After logout, the same token cannot be used again.

### Error Response

```json
{
  "success": false,
  "message": "Token has been logged out"
}
```