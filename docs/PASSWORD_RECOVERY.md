# Password Recovery and Reset Documentation

## Overview
The EcoVoucher API provides a secure password recovery system that supports both individual users (PF - Pessoa Física) and companies (PJ - Pessoa Jurídica).

## Flow Description

### 1. Password Recovery Request
**Endpoint:** `POST /api/user/auth/recuperar-senha`

**Request:**
```json
{
    "cpfOuCnpj": "12345678901" // CPF (11 digits) or CNPJ (14 digits)
}
```

**Process:**
- Validates CPF/CNPJ format
- Finds user in User or Company collection
- Generates 6-digit numeric token
- Cleans up any existing tokens for the user
- Sends formatted email with token
- Token expires in 15 minutes

**Response:**
```json
{
    "sucesso": true,
    "message": "Digite código de 6 dígitos enviado por Email para t***@example.com"
}
```

### 2. Token Validation (Optional)
**Endpoint:** `GET /api/user/auth/validar-token/:token`

**Process:**
- Validates token format (6 numeric digits)
- Checks if token exists and is not expired
- Automatically cleans up expired tokens

**Response:**
```json
{
    "error": false,
    "message": "Token válido.",
    "valido": true
}
```

### 3. Password Reset
**Endpoint:** `POST /api/user/auth/redefinir-senha`

**Request:**
```json
{
    "token": "123456", // 6-digit token from email
    "senha": "NewP@ssw0rd123" // New password meeting security requirements
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one letter (A-Z or a-z)
- At least one digit (0-9)
- At least one special character

**Process:**
- Validates token format and password strength
- Verifies token exists and is not expired
- Updates user password (automatically hashed by pre-save hook)
- Removes used token
- Cleans up expired tokens

**Response:**
```json
{
    "error": false,
    "message": "Senha redefinida com sucesso."
}
```

## Security Features

### Token Security
- Tokens are random 6-digit numeric codes
- 15-minute expiration time
- Automatic cleanup of expired tokens
- One-time use (deleted after successful password reset)
- Previous tokens invalidated when new ones are generated

### Password Security
- Passwords are hashed using bcrypt with 10 rounds
- Pre-save hooks only hash when password is new or modified
- Strong password validation prevents weak passwords
- No password information leaked in error messages

### Rate Limiting Considerations
- Each request for password recovery invalidates previous tokens
- Email sending provides natural rate limiting
- Failed attempts don't reveal user existence details

## Error Handling

### Common Error Responses

#### Invalid CPF/CNPJ Format (400)
```json
{
    "errors": [
        {
            "msg": "CPF/CNPJ inválido!",
            "param": "cpfOuCnpj"
        }
    ]
}
```

#### User Not Found (404)
```json
{
    "error": true,
    "message": "Usuário não encontrado!"
}
```

#### Invalid Token Format (400)
```json
{
    "error": true,
    "message": "Token inválido. Deve ser um código numérico de 6 dígitos."
}
```

#### Expired Token (400)
```json
{
    "error": true,
    "message": "Token expirado."
}
```

#### Weak Password (400)
```json
{
    "error": true,
    "message": "A nova senha deve ter no mínimo 6 caracteres, incluindo letras, números e pelo menos um caractere especial."
}
```

## Database Models

### Token Model
```javascript
{
    idUser: ObjectId, // Reference to user or company
    token: String,    // 6-digit numeric code
    created_at: Date, // Token creation time
    expires_at: Date  // Expiration time (15 minutes from creation)
}
```

### User/Company Password Handling
- Pre-save hooks automatically hash passwords when new or modified
- Uses bcrypt with 10 rounds
- Prevents double-hashing issues

## Testing

### Password Validation Tests
- Weak passwords are correctly rejected
- Strong passwords are accepted
- Format validation works correctly

### Token Validation Tests  
- Invalid token formats rejected
- Non-existent tokens handled properly
- Expired tokens cleaned up automatically

### Integration Tests
- Full password recovery flow
- Error handling scenarios
- Security edge cases

## Email Template
The system sends a professional HTML email with:
- 6-digit verification code in highlighted boxes
- Security warnings and tips
- Professional EcoVoucher branding
- 15-minute expiration notice