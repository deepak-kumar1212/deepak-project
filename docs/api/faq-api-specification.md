# FAQ API Specification

---

## Document Control

| **Attribute** | **Details** |
|---------------|-------------|
| **Document Title** | FAQ API Specification |
| **Version** | 1.0 |
| **Date** | January 2025 |
| **Document Owner** | API Development Team |
| **Status** | Draft |
| **Classification** | Internal Use Only |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [API Overview](#2-api-overview)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Data Models](#4-data-models)
5. [API Endpoints](#5-api-endpoints)
6. [Request & Response Formats](#6-request--response-formats)
7. [Error Handling](#7-error-handling)
8. [Validation Rules](#8-validation-rules)
9. [Security Requirements](#9-security-requirements)
10. [Performance Considerations](#10-performance-considerations)
11. [Compliance & Data Protection](#11-compliance--data-protection)
12. [Appendix](#12-appendix)

---

## 1. Introduction

### 1.1 Purpose

This document provides a comprehensive specification for the FAQ (Frequently Asked Questions) API. It defines RESTful endpoints, data models, authentication mechanisms, and operational requirements for managing FAQ content within the application ecosystem.

### 1.2 Scope

The FAQ API enables:
- **Public Access**: Unauthenticated users can browse, search, and filter published FAQs
- **Content Management**: Authenticated administrators can create, update, and delete FAQ entries and categories
- **Categorization**: Hierarchical category structure with nested support
- **Tagging System**: Flexible tagging for cross-category content discovery
- **Search Capabilities**: Full-text search across questions and answers
- **Analytics**: View count tracking for content optimization

### 1.3 Audience

This specification is intended for:
- Backend developers implementing the API
- Frontend developers consuming the API
- QA engineers designing test cases
- DevOps engineers configuring infrastructure
- Product managers defining feature requirements
- Security teams conducting audits

### 1.4 Related Documents

- **User Login BRD**: Authentication and authorization framework
- **System Architecture**: Overall application architecture and integration points
- **Security Standards**: OWASP guidelines and organizational security policies
- **Data Protection Policy**: GDPR/CCPA compliance requirements

---

## 2. API Overview

### 2.1 Base URL

```
Production:  https://api.example.com/api/v1
Staging:     https://api-staging.example.com/api/v1
Development: http://localhost:3000/api/v1
```

### 2.2 API Versioning

- **Current Version**: v1
- **Versioning Strategy**: URI-based versioning (`/api/v1/`, `/api/v2/`)
- **Deprecation Policy**: Minimum 6 months notice before version deprecation
- **Version Header**: Optional `API-Version` header for future compatibility

### 2.3 Protocol

- **Transport**: HTTPS only (TLS 1.2 or higher)
- **Content Type**: `application/json`
- **Character Encoding**: UTF-8
- **HTTP Methods**: GET, POST, PUT, DELETE

### 2.4 Rate Limiting

| **User Type** | **Rate Limit** | **Window** |
|---------------|----------------|------------|
| Public (unauthenticated) | 100 requests | 1 minute |
| Authenticated users | 1,000 requests | 1 minute |
| Admin users | 5,000 requests | 1 minute |

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```




---

## 3. Authentication & Authorization

### 3.1 Authentication Mechanism

The FAQ API uses **JWT (JSON Web Token) Bearer authentication** aligned with the User Login BRD authentication flow.

#### 3.1.1 Token Format

```
Authorization: Bearer <JWT_TOKEN>
```

#### 3.1.2 Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "roles": ["admin", "content_manager"],
    "permissions": ["faq:read", "faq:create", "faq:update", "faq:delete"],
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

#### 3.1.3 Token Lifecycle

- **Expiration**: 24 hours from issuance
- **Refresh**: Use refresh token endpoint from User Login system
- **Revocation**: Tokens invalidated on logout or password change
- **Storage**: Client-side secure storage (HttpOnly cookies recommended)

### 3.2 Authorization Model

#### 3.2.1 Role-Based Access Control (RBAC)

| **Role** | **Description** | **Permissions** |
|----------|-----------------|-----------------|
| `admin` | Full system access | All FAQ operations (read, create, update, delete) |
| `content_manager` | Content management access | Create, update, and publish FAQs; manage categories |
| `editor` | Limited editing access | Update existing FAQs (draft status only) |
| `viewer` | Read-only access | View all FAQs including drafts |
| `public` | Unauthenticated users | View published FAQs only |

#### 3.2.2 Permission Checks

| **Permission** | **Description** | **Required Roles** |
|----------------|-----------------|-------------------|
| `faq:read` | View all FAQs (including drafts) | admin, content_manager, editor, viewer |
| `faq:create` | Create new FAQs | admin, content_manager |
| `faq:update` | Update existing FAQs | admin, content_manager, editor |
| `faq:delete` | Delete FAQs (soft delete) | admin, content_manager |
| `faq:publish` | Change FAQ status to published | admin, content_manager |
| `category:manage` | Create/update/delete categories | admin, content_manager |

### 3.3 Public vs. Protected Endpoints

#### 3.3.1 Public Endpoints (No Authentication Required)

- `GET /api/v1/faqs` - List published FAQs
- `GET /api/v1/faqs/:id` - Get single published FAQ
- `GET /api/v1/faq-categories` - List all categories

**Note**: Public endpoints only return FAQs with `status: published`

#### 3.3.2 Protected Endpoints (Authentication Required)

- `POST /api/v1/faqs` - Create FAQ
- `PUT /api/v1/faqs/:id` - Update FAQ
- `DELETE /api/v1/faqs/:id` - Delete FAQ
- `POST /api/v1/faq-categories` - Create category
- `PUT /api/v1/faq-categories/:id` - Update category
- `DELETE /api/v1/faq-categories/:id` - Delete category

### 3.4 Authentication Error Responses

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please provide a valid JWT token.",
    "details": []
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions. Required permission: faq:create",
    "details": [
      {
        "field": "permissions",
        "required": ["faq:create"],
        "current": ["faq:read"]
      }
    ]
  }
}
```




---

## 4. Data Models

### 4.1 FAQ Entity

The core FAQ entity represents a single frequently asked question and its answer.

#### 4.1.1 Schema

| **Field** | **Type** | **Required** | **Description** | **Constraints** |
|-----------|----------|--------------|-----------------|-----------------|
| `id` | UUID | Yes | Unique identifier | Auto-generated, immutable |
| `question` | String | Yes | The question text | 10-500 characters, no HTML |
| `answer` | Text | Yes | The answer content | 20-10,000 characters, sanitized HTML allowed |
| `category_id` | UUID | Yes | Reference to category | Must exist in categories table |
| `tags` | Array[String] | No | Associated tags | Max 10 tags, each 2-50 chars |
| `status` | Enum | Yes | Publication status | `draft`, `published`, `archived` |
| `created_at` | Timestamp | Yes | Creation timestamp | ISO 8601 format, auto-generated |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 format, auto-updated |
| `created_by` | UUID | Yes | User ID of creator | Reference to users table |
| `updated_by` | UUID | Yes | User ID of last updater | Reference to users table |
| `view_count` | Integer | Yes | Number of views | Default: 0, incremented on GET |
| `display_order` | Integer | Yes | Sort order within category | Default: 0, manual ordering |

#### 4.1.2 JSON Representation

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "question": "How do I reset my password?",
  "answer": "<p>To reset your password, click the 'Forgot Password' link on the login page. You will receive an email with instructions to create a new password.</p>",
  "category_id": "660e8400-e29b-41d4-a716-446655440001",
  "tags": ["password", "account", "security"],
  "status": "published",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T14:45:00Z",
  "created_by": "770e8400-e29b-41d4-a716-446655440002",
  "updated_by": "770e8400-e29b-41d4-a716-446655440002",
  "view_count": 1523,
  "display_order": 1
}
```

#### 4.1.3 Status Enum Values

| **Value** | **Description** | **Visibility** |
|-----------|-----------------|----------------|
| `draft` | Work in progress, not published | Admin/content managers only |
| `published` | Live and visible to public | Public and authenticated users |
| `archived` | Soft-deleted, hidden from public | Admin only (for audit trail) |

### 4.2 Category Entity

Categories organize FAQs into logical groups with support for nested hierarchies.

#### 4.2.1 Schema

| **Field** | **Type** | **Required** | **Description** | **Constraints** |
|-----------|----------|--------------|-----------------|-----------------|
| `id` | UUID | Yes | Unique identifier | Auto-generated, immutable |
| `name` | String | Yes | Category name | 2-100 characters |
| `slug` | String | Yes | URL-friendly identifier | Auto-generated, unique, lowercase |
| `description` | Text | No | Category description | Max 500 characters |
| `parent_id` | UUID | No | Parent category ID | Nullable, enables nesting |
| `display_order` | Integer | Yes | Sort order | Default: 0, manual ordering |
| `created_at` | Timestamp | Yes | Creation timestamp | ISO 8601 format, auto-generated |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 format, auto-updated |

#### 4.2.2 JSON Representation

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Account Management",
  "slug": "account-management",
  "description": "Questions about user accounts, passwords, and profile settings",
  "parent_id": null,
  "display_order": 1,
  "created_at": "2025-01-10T09:00:00Z",
  "updated_at": "2025-01-10T09:00:00Z"
}
```

#### 4.2.3 Nested Category Example

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440003",
  "name": "Password Reset",
  "slug": "password-reset",
  "description": "Specific questions about resetting passwords",
  "parent_id": "660e8400-e29b-41d4-a716-446655440001",
  "display_order": 1,
  "created_at": "2025-01-10T09:15:00Z",
  "updated_at": "2025-01-10T09:15:00Z"
}
```

### 4.3 Tag Entity

Tags provide flexible cross-category content discovery and filtering.

#### 4.3.1 Schema

| **Field** | **Type** | **Required** | **Description** | **Constraints** |
|-----------|----------|--------------|-----------------|-----------------|
| `id` | UUID | Yes | Unique identifier | Auto-generated, immutable |
| `name` | String | Yes | Tag name | 2-50 characters |
| `slug` | String | Yes | URL-friendly identifier | Auto-generated, unique, lowercase |
| `usage_count` | Integer | Yes | Number of FAQs using this tag | Default: 0, auto-calculated |

#### 4.3.2 JSON Representation

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440004",
  "name": "Password",
  "slug": "password",
  "usage_count": 45
}
```

### 4.4 Database Relationships

```
Categories (1) ──< (N) FAQs
Categories (1) ──< (N) Categories (self-referencing for nesting)
FAQs (N) ──< (N) Tags (many-to-many through junction table)
Users (1) ──< (N) FAQs (created_by)
Users (1) ──< (N) FAQs (updated_by)
```

### 4.5 Database Indexes

For optimal query performance, the following indexes are required:

| **Table** | **Index** | **Type** | **Purpose** |
|-----------|-----------|----------|-------------|
| `faqs` | `id` | Primary Key | Unique identifier lookup |
| `faqs` | `category_id` | Foreign Key | Category filtering |
| `faqs` | `status` | B-tree | Status filtering |
| `faqs` | `created_at` | B-tree | Date sorting |
| `faqs` | `display_order` | B-tree | Manual ordering |
| `faqs` | `question, answer` | Full-text | Search functionality |
| `categories` | `id` | Primary Key | Unique identifier lookup |
| `categories` | `slug` | Unique | URL-based lookup |
| `categories` | `parent_id` | Foreign Key | Nested category queries |
| `tags` | `id` | Primary Key | Unique identifier lookup |
| `tags` | `slug` | Unique | URL-based lookup |




---

## 5. API Endpoints

### 5.1 FAQ Endpoints

#### 5.1.1 List All FAQs

**Endpoint**: `GET /api/v1/faqs`

**Description**: Retrieve a paginated list of FAQs with optional filtering, searching, and sorting.

**Authentication**: Optional (public returns only published FAQs, authenticated can see drafts with proper permissions)

**Query Parameters**:

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
|---------------|----------|--------------|-------------|-----------------|
| `page` | Integer | No | 1 | Page number (1-indexed) |
| `limit` | Integer | No | 20 | Items per page (max: 100) |
| `category` | UUID | No | - | Filter by category ID |
| `tags` | String | No | - | Comma-separated tag slugs (e.g., `password,security`) |
| `status` | String | No | `published` | Filter by status (`draft`, `published`, `archived`) |
| `q` | String | No | - | Search query (searches question and answer) |
| `sort` | String | No | `display_order` | Sort field (`created_at`, `updated_at`, `view_count`, `display_order`) |
| `order` | String | No | `asc` | Sort order (`asc`, `desc`) |

**Request Example**:

```http
GET /api/v1/faqs?page=1&limit=20&category=660e8400-e29b-41d4-a716-446655440001&tags=password,security&q=reset&sort=view_count&order=desc
Host: api.example.com
Accept: application/json
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "question": "How do I reset my password?",
      "answer": "<p>To reset your password, click the 'Forgot Password' link on the login page...</p>",
      "category_id": "660e8400-e29b-41d4-a716-446655440001",
      "category": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Account Management",
        "slug": "account-management"
      },
      "tags": ["password", "account", "security"],
      "status": "published",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:45:00Z",
      "view_count": 1523,
      "display_order": 1
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Performance Optimization**: In list view, the `answer` field can be truncated to first 200 characters with `...` suffix to reduce payload size. Full answer available in single FAQ endpoint.

---

#### 5.1.2 Get Single FAQ

**Endpoint**: `GET /api/v1/faqs/:id`

**Description**: Retrieve a single FAQ by its unique identifier. Increments view count.

**Authentication**: Optional (public can only view published FAQs)

**Path Parameters**:

| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|-----------------|
| `id` | UUID | Yes | FAQ unique identifier |

**Request Example**:

```http
GET /api/v1/faqs/550e8400-e29b-41d4-a716-446655440000
Host: api.example.com
Accept: application/json
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "question": "How do I reset my password?",
    "answer": "<p>To reset your password, follow these steps:</p><ol><li>Click the 'Forgot Password' link on the login page</li><li>Enter your registered email address</li><li>Check your email for a password reset link</li><li>Click the link and create a new password</li></ol><p>The reset link expires after 1 hour for security reasons.</p>",
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Account Management",
      "slug": "account-management",
      "description": "Questions about user accounts, passwords, and profile settings"
    },
    "tags": ["password", "account", "security"],
    "status": "published",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-20T14:45:00Z",
    "created_by": "770e8400-e29b-41d4-a716-446655440002",
    "updated_by": "770e8400-e29b-41d4-a716-446655440002",
    "view_count": 1524,
    "display_order": 1
  }
}
```

**Error Response** (404 Not Found):

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "FAQ not found with ID: 550e8400-e29b-41d4-a716-446655440000",
    "details": []
  }
}
```

---

#### 5.1.3 Create FAQ

**Endpoint**: `POST /api/v1/faqs`

**Description**: Create a new FAQ entry.

**Authentication**: Required (JWT Bearer token)

**Required Permissions**: `faq:create`

**Required Roles**: `admin`, `content_manager`

**Request Headers**:

```http
POST /api/v1/faqs
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:

```json
{
  "question": "How do I enable two-factor authentication?",
  "answer": "<p>To enable two-factor authentication (2FA):</p><ol><li>Go to your account settings</li><li>Click on 'Security'</li><li>Enable 'Two-Factor Authentication'</li><li>Scan the QR code with your authenticator app</li><li>Enter the verification code to confirm</li></ol>",
  "category_id": "660e8400-e29b-41d4-a716-446655440001",
  "tags": ["security", "2fa", "authentication"],
  "status": "draft",
  "display_order": 5
}
```

**Request Body Schema**:

| **Field** | **Type** | **Required** | **Description** |
|-----------|----------|--------------|-----------------|
| `question` | String | Yes | Question text (10-500 chars) |
| `answer` | String | Yes | Answer content (20-10,000 chars) |
| `category_id` | UUID | Yes | Valid category ID |
| `tags` | Array[String] | No | Tag names (max 10) |
| `status` | String | No | Status (default: `draft`) |
| `display_order` | Integer | No | Display order (default: 0) |

**Response Example** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "question": "How do I enable two-factor authentication?",
    "answer": "<p>To enable two-factor authentication (2FA):</p><ol><li>Go to your account settings</li><li>Click on 'Security'</li><li>Enable 'Two-Factor Authentication'</li><li>Scan the QR code with your authenticator app</li><li>Enter the verification code to confirm</li></ol>",
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Account Management",
      "slug": "account-management"
    },
    "tags": ["security", "2fa", "authentication"],
    "status": "draft",
    "created_at": "2025-01-25T16:20:00Z",
    "updated_at": "2025-01-25T16:20:00Z",
    "created_by": "770e8400-e29b-41d4-a716-446655440002",
    "updated_by": "770e8400-e29b-41d4-a716-446655440002",
    "view_count": 0,
    "display_order": 5
  }
}
```

**Audit Log Entry**: System logs creation event with user_id, timestamp, IP address, and full FAQ data.

---

#### 5.1.4 Update FAQ

**Endpoint**: `PUT /api/v1/faqs/:id`

**Description**: Update an existing FAQ entry.

**Authentication**: Required (JWT Bearer token)

**Required Permissions**: `faq:update`

**Required Roles**: `admin`, `content_manager`, `editor`

**Path Parameters**:

| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|-----------------|
| `id` | UUID | Yes | FAQ unique identifier |

**Request Headers**:

```http
PUT /api/v1/faqs/990e8400-e29b-41d4-a716-446655440005
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body** (partial update supported):

```json
{
  "question": "How do I enable two-factor authentication (2FA)?",
  "status": "published"
}
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "question": "How do I enable two-factor authentication (2FA)?",
    "answer": "<p>To enable two-factor authentication (2FA):</p><ol><li>Go to your account settings</li><li>Click on 'Security'</li><li>Enable 'Two-Factor Authentication'</li><li>Scan the QR code with your authenticator app</li><li>Enter the verification code to confirm</li></ol>",
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Account Management",
      "slug": "account-management"
    },
    "tags": ["security", "2fa", "authentication"],
    "status": "published",
    "created_at": "2025-01-25T16:20:00Z",
    "updated_at": "2025-01-25T17:30:00Z",
    "created_by": "770e8400-e29b-41d4-a716-446655440002",
    "updated_by": "770e8400-e29b-41d4-a716-446655440002",
    "view_count": 0,
    "display_order": 5
  }
}
```

**Audit Log Entry**: System logs update event with user_id, timestamp, IP address, and changed fields (before/after values).

---

#### 5.1.5 Delete FAQ

**Endpoint**: `DELETE /api/v1/faqs/:id`

**Description**: Soft delete an FAQ by changing status to `archived`.

**Authentication**: Required (JWT Bearer token)

**Required Permissions**: `faq:delete`

**Required Roles**: `admin`, `content_manager`

**Path Parameters**:

| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|-----------------|
| `id` | UUID | Yes | FAQ unique identifier |

**Request Example**:

```http
DELETE /api/v1/faqs/990e8400-e29b-41d4-a716-446655440005
Host: api.example.com
Authorization: Bearer <JWT_TOKEN>
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "status": "archived",
    "deleted_at": "2025-01-26T10:15:00Z",
    "deleted_by": "770e8400-e29b-41d4-a716-446655440002"
  }
}
```

**Note**: Soft delete preserves data for audit trail. Hard delete not supported via API for compliance reasons.

**Audit Log Entry**: System logs deletion event with user_id, timestamp, IP address, and archived FAQ data.




---

### 5.2 Category Endpoints

#### 5.2.1 List All Categories

**Endpoint**: `GET /api/v1/faq-categories`

**Description**: Retrieve all FAQ categories with optional nested structure.

**Authentication**: Not required (public endpoint)

**Query Parameters**:

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
|---------------|----------|--------------|-------------|-----------------|
| `nested` | Boolean | No | false | Return hierarchical structure |
| `include_count` | Boolean | No | false | Include FAQ count per category |

**Request Example**:

```http
GET /api/v1/faq-categories?nested=true&include_count=true
Host: api.example.com
Accept: application/json
```

**Response Example - Flat Structure** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Account Management",
      "slug": "account-management",
      "description": "Questions about user accounts, passwords, and profile settings",
      "parent_id": null,
      "display_order": 1,
      "faq_count": 12,
      "created_at": "2025-01-10T09:00:00Z",
      "updated_at": "2025-01-10T09:00:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440003",
      "name": "Password Reset",
      "slug": "password-reset",
      "description": "Specific questions about resetting passwords",
      "parent_id": "660e8400-e29b-41d4-a716-446655440001",
      "display_order": 1,
      "faq_count": 5,
      "created_at": "2025-01-10T09:15:00Z",
      "updated_at": "2025-01-10T09:15:00Z"
    }
  ]
}
```

**Response Example - Nested Structure** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Account Management",
      "slug": "account-management",
      "description": "Questions about user accounts, passwords, and profile settings",
      "parent_id": null,
      "display_order": 1,
      "faq_count": 12,
      "children": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440003",
          "name": "Password Reset",
          "slug": "password-reset",
          "description": "Specific questions about resetting passwords",
          "parent_id": "660e8400-e29b-41d4-a716-446655440001",
          "display_order": 1,
          "faq_count": 5,
          "children": [],
          "created_at": "2025-01-10T09:15:00Z",
          "updated_at": "2025-01-10T09:15:00Z"
        }
      ],
      "created_at": "2025-01-10T09:00:00Z",
      "updated_at": "2025-01-10T09:00:00Z"
    }
  ]
}
```

---

#### 5.2.2 Get Single Category

**Endpoint**: `GET /api/v1/faq-categories/:id`

**Description**: Retrieve a single category by ID or slug.

**Authentication**: Not required (public endpoint)

**Path Parameters**:

| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|-----------------|
| `id` | UUID or String | Yes | Category ID or slug |

**Request Example**:

```http
GET /api/v1/faq-categories/account-management
Host: api.example.com
Accept: application/json
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Account Management",
    "slug": "account-management",
    "description": "Questions about user accounts, passwords, and profile settings",
    "parent_id": null,
    "display_order": 1,
    "faq_count": 12,
    "created_at": "2025-01-10T09:00:00Z",
    "updated_at": "2025-01-10T09:00:00Z"
  }
}
```

---

#### 5.2.3 Create Category

**Endpoint**: `POST /api/v1/faq-categories`

**Description**: Create a new FAQ category.

**Authentication**: Required (JWT Bearer token)

**Required Permissions**: `category:manage`

**Required Roles**: `admin`, `content_manager`

**Request Headers**:

```http
POST /api/v1/faq-categories
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:

```json
{
  "name": "Billing & Payments",
  "description": "Questions about billing, invoices, and payment methods",
  "parent_id": null,
  "display_order": 3
}
```

**Request Body Schema**:

| **Field** | **Type** | **Required** | **Description** |
|-----------|----------|--------------|-----------------|
| `name` | String | Yes | Category name (2-100 chars) |
| `description` | String | No | Category description (max 500 chars) |
| `parent_id` | UUID | No | Parent category for nesting |
| `display_order` | Integer | No | Display order (default: 0) |

**Response Example** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440006",
    "name": "Billing & Payments",
    "slug": "billing-payments",
    "description": "Questions about billing, invoices, and payment methods",
    "parent_id": null,
    "display_order": 3,
    "created_at": "2025-01-26T11:00:00Z",
    "updated_at": "2025-01-26T11:00:00Z"
  }
}
```

**Note**: Slug is auto-generated from name (lowercase, hyphenated, URL-safe).

---

#### 5.2.4 Update Category

**Endpoint**: `PUT /api/v1/faq-categories/:id`

**Description**: Update an existing category.

**Authentication**: Required (JWT Bearer token)

**Required Permissions**: `category:manage`

**Required Roles**: `admin`, `content_manager`

**Path Parameters**:

| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|-----------------|
| `id` | UUID | Yes | Category unique identifier |

**Request Example**:

```http
PUT /api/v1/faq-categories/aa0e8400-e29b-41d4-a716-446655440006
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body** (partial update supported):

```json
{
  "name": "Billing, Payments & Subscriptions",
  "description": "Questions about billing, invoices, payment methods, and subscription management"
}
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440006",
    "name": "Billing, Payments & Subscriptions",
    "slug": "billing-payments-subscriptions",
    "description": "Questions about billing, invoices, payment methods, and subscription management",
    "parent_id": null,
    "display_order": 3,
    "created_at": "2025-01-26T11:00:00Z",
    "updated_at": "2025-01-26T12:30:00Z"
  }
}
```

---

#### 5.2.5 Delete Category

**Endpoint**: `DELETE /api/v1/faq-categories/:id`

**Description**: Delete a category (only if no FAQs are associated).

**Authentication**: Required (JWT Bearer token)

**Required Permissions**: `category:manage`

**Required Roles**: `admin`, `content_manager`

**Path Parameters**:

| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|-----------------|
| `id` | UUID | Yes | Category unique identifier |

**Request Example**:

```http
DELETE /api/v1/faq-categories/aa0e8400-e29b-41d4-a716-446655440006
Host: api.example.com
Authorization: Bearer <JWT_TOKEN>
```

**Response Example** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440006",
    "deleted": true
  }
}
```

**Error Response** (409 Conflict - Category has FAQs):

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot delete category with associated FAQs. Please reassign or delete FAQs first.",
    "details": [
      {
        "field": "faq_count",
        "value": 8
      }
    ]
  }
}
```




---

## 6. Request & Response Formats

### 6.1 Standard Response Envelope

All API responses follow a consistent envelope structure for predictable client-side handling.

#### 6.1.1 Success Response Structure

```json
{
  "success": true,
  "data": <object|array>,
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Fields**:
- `success` (boolean): Always `true` for successful responses
- `data` (object|array): Response payload (single object or array of objects)
- `meta` (object, optional): Pagination metadata (only for list endpoints)

#### 6.1.2 Error Response Structure

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error message"
      }
    ]
  }
}
```

**Fields**:
- `success` (boolean): Always `false` for error responses
- `error.code` (string): Machine-readable error code (e.g., `VALIDATION_ERROR`, `NOT_FOUND`)
- `error.message` (string): Human-readable error description
- `error.details` (array, optional): Field-level validation errors or additional context

### 6.2 Pagination

#### 6.2.1 Query Parameters

| **Parameter** | **Type** | **Default** | **Min** | **Max** | **Description** |
|---------------|----------|-------------|---------|---------|-----------------|
| `page` | Integer | 1 | 1 | - | Page number (1-indexed) |
| `limit` | Integer | 20 | 1 | 100 | Items per page |

#### 6.2.2 Pagination Metadata

```json
{
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 87,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

**Fields**:
- `page`: Current page number
- `limit`: Items per page
- `total`: Total number of items across all pages
- `totalPages`: Total number of pages
- `hasNextPage`: Boolean indicating if next page exists
- `hasPreviousPage`: Boolean indicating if previous page exists

#### 6.2.3 Pagination Links (Optional)

For enhanced client navigation, pagination links can be included:

```json
{
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 87,
    "totalPages": 5,
    "links": {
      "first": "/api/v1/faqs?page=1&limit=20",
      "previous": "/api/v1/faqs?page=1&limit=20",
      "next": "/api/v1/faqs?page=3&limit=20",
      "last": "/api/v1/faqs?page=5&limit=20"
    }
  }
}
```

### 6.3 Filtering

#### 6.3.1 Category Filter

Filter FAQs by category ID:

```http
GET /api/v1/faqs?category=660e8400-e29b-41d4-a716-446655440001
```

#### 6.3.2 Tag Filter

Filter FAQs by one or more tags (comma-separated):

```http
GET /api/v1/faqs?tags=password,security
```

**Behavior**: Returns FAQs that have ANY of the specified tags (OR logic).

#### 6.3.3 Status Filter

Filter FAQs by publication status:

```http
GET /api/v1/faqs?status=published
```

**Valid values**: `draft`, `published`, `archived`

**Note**: Public (unauthenticated) requests automatically filter to `status=published` regardless of query parameter.

#### 6.3.4 Combined Filters

Multiple filters can be combined:

```http
GET /api/v1/faqs?category=660e8400-e29b-41d4-a716-446655440001&tags=password&status=published
```

### 6.4 Searching

#### 6.4.1 Full-Text Search

Search across question and answer fields:

```http
GET /api/v1/faqs?q=password+reset
```

**Search Behavior**:
- Case-insensitive
- Searches both `question` and `answer` fields
- Supports partial word matching
- Uses database full-text search indexes for performance
- Results ranked by relevance

#### 6.4.2 Search with Filters

Search can be combined with filters:

```http
GET /api/v1/faqs?q=authentication&category=660e8400-e29b-41d4-a716-446655440001&tags=security
```

### 6.5 Sorting

#### 6.5.1 Sort Parameters

| **Parameter** | **Type** | **Default** | **Description** |
|---------------|----------|-------------|-----------------|
| `sort` | String | `display_order` | Field to sort by |
| `order` | String | `asc` | Sort direction (`asc`, `desc`) |

#### 6.5.2 Supported Sort Fields

| **Field** | **Description** | **Use Case** |
|-----------|-----------------|--------------|
| `display_order` | Manual ordering | Default display order set by admins |
| `created_at` | Creation date | Show newest/oldest FAQs |
| `updated_at` | Last update date | Show recently updated FAQs |
| `view_count` | Number of views | Show most popular FAQs |
| `question` | Alphabetical by question | A-Z sorting |

#### 6.5.3 Sort Examples

Most viewed FAQs:
```http
GET /api/v1/faqs?sort=view_count&order=desc
```

Recently created FAQs:
```http
GET /api/v1/faqs?sort=created_at&order=desc
```

Alphabetical order:
```http
GET /api/v1/faqs?sort=question&order=asc
```

### 6.6 Field Selection (Sparse Fieldsets)

To reduce payload size, clients can request specific fields:

```http
GET /api/v1/faqs?fields=id,question,category_id,tags
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "question": "How do I reset my password?",
      "category_id": "660e8400-e29b-41d4-a716-446655440001",
      "tags": ["password", "account", "security"]
    }
  ]
}
```

**Note**: `id` field is always included regardless of field selection.

### 6.7 Content Negotiation

#### 6.7.1 Request Headers

```http
Accept: application/json
Content-Type: application/json
```

#### 6.7.2 Response Headers

```http
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### 6.8 Date/Time Format

All timestamps use **ISO 8601 format** with UTC timezone:

```
2025-01-26T14:30:00Z
```

**Format**: `YYYY-MM-DDTHH:mm:ssZ`




---

## 7. Error Handling

### 7.1 HTTP Status Codes

The API uses standard HTTP status codes to indicate success or failure:

| **Status Code** | **Meaning** | **Description** |
|-----------------|-------------|-----------------|
| **200 OK** | Success | Request succeeded (GET, PUT, DELETE) |
| **201 Created** | Resource created | New resource created successfully (POST) |
| **204 No Content** | Success with no body | Request succeeded with no response body |
| **400 Bad Request** | Invalid input | Request validation failed (malformed JSON, invalid parameters) |
| **401 Unauthorized** | Authentication required | Missing or invalid JWT token |
| **403 Forbidden** | Insufficient permissions | Valid token but lacks required permissions |
| **404 Not Found** | Resource not found | Requested resource does not exist |
| **409 Conflict** | Conflict | Duplicate resource or constraint violation |
| **422 Unprocessable Entity** | Business logic error | Valid request but business rules prevent processing |
| **429 Too Many Requests** | Rate limit exceeded | Client exceeded rate limit |
| **500 Internal Server Error** | Server error | Unexpected server-side error |
| **503 Service Unavailable** | Service unavailable | Temporary service outage or maintenance |

### 7.2 Error Response Format

All error responses follow the standard error envelope:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": []
  }
}
```

### 7.3 Error Codes

#### 7.3.1 Authentication & Authorization Errors

**401 Unauthorized - Missing Token**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please provide a valid JWT token.",
    "details": []
  }
}
```

**401 Unauthorized - Invalid Token**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired JWT token. Please authenticate again.",
    "details": [
      {
        "reason": "Token expired at 2025-01-25T10:00:00Z"
      }
    ]
  }
}
```

**403 Forbidden - Insufficient Permissions**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to perform this action.",
    "details": [
      {
        "required_permission": "faq:create",
        "user_permissions": ["faq:read"]
      }
    ]
  }
}
```

#### 7.3.2 Validation Errors

**400 Bad Request - Invalid Input**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed. Please check the details.",
    "details": [
      {
        "field": "question",
        "message": "Question must be between 10 and 500 characters",
        "value": "Short"
      },
      {
        "field": "category_id",
        "message": "Category ID must be a valid UUID",
        "value": "invalid-uuid"
      }
    ]
  }
}
```

**422 Unprocessable Entity - Business Logic Error**:
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_LOGIC_ERROR",
    "message": "Cannot publish FAQ without a valid answer.",
    "details": [
      {
        "field": "status",
        "message": "FAQs must have an answer before publishing",
        "current_status": "draft"
      }
    ]
  }
}
```

#### 7.3.3 Resource Errors

**404 Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "FAQ not found with ID: 550e8400-e29b-41d4-a716-446655440000",
    "details": []
  }
}
```

**409 Conflict - Duplicate Slug**:
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Category with slug 'account-management' already exists.",
    "details": [
      {
        "field": "slug",
        "value": "account-management",
        "existing_id": "660e8400-e29b-41d4-a716-446655440001"
      }
    ]
  }
}
```

**409 Conflict - Cannot Delete Category with FAQs**:
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot delete category with associated FAQs. Please reassign or delete FAQs first.",
    "details": [
      {
        "field": "faq_count",
        "value": 12
      }
    ]
  }
}
```

#### 7.3.4 Rate Limiting Errors

**429 Too Many Requests**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": [
      {
        "limit": 100,
        "window": "1 minute",
        "retry_after": 45
      }
    ]
  }
}
```

**Response Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640995245
Retry-After: 45
```

#### 7.3.5 Server Errors

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "details": [
      {
        "request_id": "req_abc123xyz",
        "timestamp": "2025-01-26T14:30:00Z"
      }
    ]
  }
}
```

**Note**: Internal error details are logged server-side but not exposed to clients for security reasons.

**503 Service Unavailable**:
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service temporarily unavailable. Please try again later.",
    "details": [
      {
        "reason": "Scheduled maintenance",
        "estimated_recovery": "2025-01-26T16:00:00Z"
      }
    ]
  }
}
```

### 7.4 Error Logging

All errors are logged server-side with the following information:
- **Request ID**: Unique identifier for tracing
- **Timestamp**: ISO 8601 format
- **User ID**: If authenticated
- **IP Address**: Client IP
- **Endpoint**: Request path and method
- **Error Details**: Full error stack trace (server-side only)
- **Request Payload**: For debugging (sanitized to remove sensitive data)

### 7.5 Client Error Handling Best Practices

1. **Check `success` field**: Always check the `success` boolean before processing response
2. **Display user-friendly messages**: Use `error.message` for user-facing error messages
3. **Handle field-level errors**: Parse `error.details` array for form validation feedback
4. **Implement retry logic**: For 429 and 503 errors, respect `Retry-After` header
5. **Log request IDs**: Include `request_id` from error details when reporting issues
6. **Handle token expiration**: Implement automatic token refresh on 401 errors




---

## 8. Validation Rules

### 8.1 FAQ Validation

#### 8.1.1 Question Field

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | Yes | "Question is required" |
| Min Length | 10 characters | "Question must be at least 10 characters" |
| Max Length | 500 characters | "Question must not exceed 500 characters" |
| HTML Tags | Not allowed | "Question cannot contain HTML tags" |
| Special Characters | Allowed (except HTML) | - |
| Whitespace | Trimmed | - |

**Validation Example**:
```javascript
// Valid
"How do I reset my password?"

// Invalid - Too short
"Password?" // Error: Question must be at least 10 characters

// Invalid - HTML tags
"How do I <b>reset</b> my password?" // Error: Question cannot contain HTML tags
```

#### 8.1.2 Answer Field

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | Yes | "Answer is required" |
| Min Length | 20 characters | "Answer must be at least 20 characters" |
| Max Length | 10,000 characters | "Answer must not exceed 10,000 characters" |
| HTML Tags | Allowed (sanitized) | - |
| Allowed HTML Tags | `<p>`, `<br>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<a>`, `<code>`, `<pre>` | "Answer contains disallowed HTML tags" |
| Script Tags | Not allowed | "Answer cannot contain script tags" |

**HTML Sanitization**:
- Strip all `<script>`, `<iframe>`, `<object>`, `<embed>` tags
- Remove `onclick`, `onerror`, and other event handlers
- Sanitize `href` attributes to prevent `javascript:` URLs
- Allow only safe HTML tags listed above

**Validation Example**:
```javascript
// Valid
"<p>To reset your password:</p><ol><li>Click 'Forgot Password'</li><li>Check your email</li></ol>"

// Invalid - Too short
"Reset via email" // Error: Answer must be at least 20 characters

// Invalid - Script tag
"<script>alert('xss')</script>Reset password" // Error: Answer cannot contain script tags
```

#### 8.1.3 Category ID

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | Yes | "Category ID is required" |
| Format | Valid UUID v4 | "Category ID must be a valid UUID" |
| Exists | Must exist in database | "Category not found with ID: {id}" |

#### 8.1.4 Tags

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | No | - |
| Max Count | 10 tags | "Maximum 10 tags allowed per FAQ" |
| Tag Length | 2-50 characters each | "Each tag must be between 2 and 50 characters" |
| Format | Alphanumeric, hyphens, underscores | "Tags can only contain letters, numbers, hyphens, and underscores" |
| Whitespace | Trimmed and lowercased | - |

**Validation Example**:
```javascript
// Valid
["password", "security", "account-management"]

// Invalid - Too many tags
["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11"]
// Error: Maximum 10 tags allowed per FAQ

// Invalid - Tag too short
["a"] // Error: Each tag must be between 2 and 50 characters
```

#### 8.1.5 Status

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | No (default: `draft`) | - |
| Allowed Values | `draft`, `published`, `archived` | "Status must be one of: draft, published, archived" |
| Case Sensitive | No (normalized to lowercase) | - |

#### 8.1.6 Display Order

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | No (default: 0) | - |
| Type | Integer | "Display order must be an integer" |
| Min Value | 0 | "Display order must be 0 or greater" |
| Max Value | 999999 | "Display order must not exceed 999999" |

### 8.2 Category Validation

#### 8.2.1 Name Field

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | Yes | "Category name is required" |
| Min Length | 2 characters | "Category name must be at least 2 characters" |
| Max Length | 100 characters | "Category name must not exceed 100 characters" |
| Whitespace | Trimmed | - |

#### 8.2.2 Slug Field

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Auto-generated | Yes (from name) | - |
| Format | Lowercase, hyphenated | - |
| Unique | Yes | "Category with slug '{slug}' already exists" |
| Pattern | `^[a-z0-9-]+$` | - |

**Slug Generation Example**:
```javascript
// Input name: "Account Management"
// Generated slug: "account-management"

// Input name: "Billing & Payments"
// Generated slug: "billing-payments"

// Input name: "FAQ's & Help"
// Generated slug: "faqs-help"
```

#### 8.2.3 Description Field

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | No | - |
| Max Length | 500 characters | "Description must not exceed 500 characters" |
| HTML Tags | Not allowed | "Description cannot contain HTML tags" |

#### 8.2.4 Parent ID

| **Rule** | **Value** | **Error Message** |
|----------|-----------|-------------------|
| Required | No | - |
| Format | Valid UUID v4 | "Parent ID must be a valid UUID" |
| Exists | Must exist in database | "Parent category not found with ID: {id}" |
| Circular Reference | Not allowed | "Cannot set parent to self or create circular reference" |
| Max Depth | 3 levels | "Maximum nesting depth of 3 levels exceeded" |

**Circular Reference Prevention**:
```javascript
// Invalid - Self-reference
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "parent_id": "660e8400-e29b-41d4-a716-446655440001"
}
// Error: Cannot set parent to self or create circular reference

// Invalid - Circular chain
// Category A -> parent: Category B
// Category B -> parent: Category A
// Error: Cannot set parent to self or create circular reference
```

### 8.3 Query Parameter Validation

#### 8.3.1 Pagination Parameters

| **Parameter** | **Type** | **Min** | **Max** | **Default** | **Error Message** |
|---------------|----------|---------|---------|-------------|-------------------|
| `page` | Integer | 1 | - | 1 | "Page must be a positive integer" |
| `limit` | Integer | 1 | 100 | 20 | "Limit must be between 1 and 100" |

#### 8.3.2 Filter Parameters

| **Parameter** | **Type** | **Validation** | **Error Message** |
|---------------|----------|----------------|-------------------|
| `category` | UUID | Valid UUID format | "Category must be a valid UUID" |
| `tags` | String | Comma-separated, each 2-50 chars | "Invalid tag format" |
| `status` | String | Enum: draft, published, archived | "Status must be one of: draft, published, archived" |

#### 8.3.3 Search Parameters

| **Parameter** | **Type** | **Min Length** | **Max Length** | **Error Message** |
|---------------|----------|----------------|----------------|-------------------|
| `q` | String | 2 | 200 | "Search query must be between 2 and 200 characters" |

#### 8.3.4 Sort Parameters

| **Parameter** | **Type** | **Allowed Values** | **Error Message** |
|---------------|----------|-------------------|-------------------|
| `sort` | String | `display_order`, `created_at`, `updated_at`, `view_count`, `question` | "Invalid sort field" |
| `order` | String | `asc`, `desc` | "Order must be 'asc' or 'desc'" |

### 8.4 Validation Error Response Example

When multiple validation errors occur, all errors are returned in a single response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed. Please check the details.",
    "details": [
      {
        "field": "question",
        "message": "Question must be at least 10 characters",
        "value": "Short",
        "constraint": {
          "min_length": 10,
          "current_length": 5
        }
      },
      {
        "field": "answer",
        "message": "Answer contains disallowed HTML tags",
        "value": "<script>alert('xss')</script>",
        "disallowed_tags": ["script"]
      },
      {
        "field": "tags",
        "message": "Maximum 10 tags allowed per FAQ",
        "value": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11"],
        "constraint": {
          "max_count": 10,
          "current_count": 11
        }
      }
    ]
  }
}
```




---

## 9. Security Requirements

### 9.1 Transport Security

#### 9.1.1 HTTPS Only

- **Requirement**: All API endpoints MUST be served over HTTPS (TLS 1.2 or higher)
- **HTTP Requests**: Automatically redirect to HTTPS with 301 Moved Permanently
- **HSTS Header**: Include Strict-Transport-Security header
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

#### 9.1.2 TLS Configuration

- **Minimum Version**: TLS 1.2
- **Recommended Version**: TLS 1.3
- **Cipher Suites**: Use only strong cipher suites (no RC4, DES, 3DES)
- **Certificate**: Valid SSL/TLS certificate from trusted CA

### 9.2 Authentication Security

#### 9.2.1 JWT Token Security

Aligned with User Login BRD authentication requirements:

- **Algorithm**: HS256 or RS256 (asymmetric preferred for production)
- **Secret Key**: Minimum 256-bit cryptographically secure random key
- **Token Expiration**: 24 hours maximum
- **Token Storage**: HttpOnly, Secure, SameSite cookies (recommended)
- **Token Rotation**: Refresh tokens before expiration
- **Token Revocation**: Implement token blacklist for logout/password change

#### 9.2.2 Password Security (for User Login integration)

- **Hashing Algorithm**: Argon2id or bcrypt (per User Login BRD)
- **Salt**: Unique per password, minimum 128-bit
- **Work Factor**: Appropriate for current hardware (bcrypt: 12+ rounds)
- **No Plaintext Storage**: Never store passwords in plaintext

### 9.3 Authorization Security

#### 9.3.1 Role-Based Access Control (RBAC)

- **Principle of Least Privilege**: Grant minimum permissions required
- **Permission Checks**: Verify permissions on every protected endpoint
- **Role Validation**: Validate user roles from JWT token payload
- **Admin Actions**: Require explicit admin role for destructive operations

#### 9.3.2 Resource Ownership

- **Creator Tracking**: Record `created_by` and `updated_by` for audit trail
- **Ownership Validation**: Verify user has permission to modify resources
- **Cross-User Access**: Prevent unauthorized access to other users' draft content

### 9.4 Input Validation & Sanitization

#### 9.4.1 XSS Prevention

- **HTML Sanitization**: Strip dangerous HTML tags and attributes from answer field
- **Allowed Tags**: Whitelist safe HTML tags only (see Validation Rules)
- **Event Handlers**: Remove all JavaScript event handlers (onclick, onerror, etc.)
- **URL Validation**: Sanitize href attributes to prevent javascript: URLs
- **Content Security Policy**: Implement CSP headers
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
  ```

#### 9.4.2 SQL Injection Prevention

- **Parameterized Queries**: Use prepared statements or ORM with parameterization
- **Input Validation**: Validate all user inputs before database queries
- **Escape Special Characters**: Properly escape SQL special characters
- **Least Privilege DB User**: Database user should have minimum required permissions

#### 9.4.3 NoSQL Injection Prevention

- **Input Validation**: Validate and sanitize all inputs
- **Type Checking**: Ensure inputs match expected types
- **Query Sanitization**: Use ORM/ODM query builders instead of raw queries

### 9.5 CORS Configuration

#### 9.5.1 Allowed Origins

- **Production**: Whitelist specific domains only
  ```
  Access-Control-Allow-Origin: https://example.com
  ```
- **Development**: Allow localhost for development
  ```
  Access-Control-Allow-Origin: http://localhost:3000
  ```
- **Wildcard**: NEVER use `*` for authenticated endpoints

#### 9.5.2 CORS Headers

```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### 9.6 Rate Limiting

#### 9.6.1 Rate Limit Configuration

| **User Type** | **Rate Limit** | **Window** | **Enforcement** |
|---------------|----------------|------------|-----------------|
| Public (unauthenticated) | 100 requests | 1 minute | IP-based |
| Authenticated users | 1,000 requests | 1 minute | User ID-based |
| Admin users | 5,000 requests | 1 minute | User ID-based |

#### 9.6.2 Rate Limit Implementation

- **Algorithm**: Token bucket or sliding window
- **Storage**: Redis for distributed rate limiting
- **Response**: 429 Too Many Requests with Retry-After header
- **Bypass**: Allow rate limit bypass for internal services (with authentication)

### 9.7 CSRF Protection

#### 9.7.1 CSRF Token

- **Requirement**: CSRF tokens for all state-changing operations (POST, PUT, DELETE)
- **Token Generation**: Cryptographically secure random tokens
- **Token Validation**: Verify token on server-side before processing request
- **Token Expiration**: Tokens expire with user session

#### 9.7.2 SameSite Cookie Attribute

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```

### 9.8 Security Headers

All API responses MUST include the following security headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 9.9 Audit Logging

#### 9.9.1 Logged Events

All create, update, and delete operations MUST be logged with:

| **Field** | **Description** | **Example** |
|-----------|-----------------|-------------|
| `event_id` | Unique event identifier | `evt_abc123xyz` |
| `timestamp` | ISO 8601 timestamp | `2025-01-26T14:30:00Z` |
| `user_id` | Authenticated user ID | `770e8400-e29b-41d4-a716-446655440002` |
| `action` | Action performed | `faq:create`, `faq:update`, `faq:delete` |
| `resource_type` | Resource type | `faq`, `category` |
| `resource_id` | Resource identifier | `550e8400-e29b-41d4-a716-446655440000` |
| `ip_address` | Client IP address | `192.168.1.100` |
| `user_agent` | Client user agent | `Mozilla/5.0...` |
| `changes` | Changed fields (for updates) | `{"status": {"from": "draft", "to": "published"}}` |
| `request_id` | Request trace ID | `req_abc123xyz` |

#### 9.9.2 Audit Log Storage

- **Retention Period**: Minimum 2 years (per GDPR/CCPA compliance)
- **Storage**: Separate audit log database or service
- **Access Control**: Restricted to security and compliance teams
- **Immutability**: Audit logs cannot be modified or deleted
- **Encryption**: Encrypt audit logs at rest

#### 9.9.3 Audit Log Example

```json
{
  "event_id": "evt_abc123xyz",
  "timestamp": "2025-01-26T14:30:00Z",
  "user_id": "770e8400-e29b-41d4-a716-446655440002",
  "user_email": "admin@example.com",
  "action": "faq:update",
  "resource_type": "faq",
  "resource_id": "550e8400-e29b-41d4-a716-446655440000",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "changes": {
    "status": {
      "from": "draft",
      "to": "published"
    },
    "updated_at": {
      "from": "2025-01-25T16:20:00Z",
      "to": "2025-01-26T14:30:00Z"
    }
  },
  "request_id": "req_abc123xyz"
}
```

### 9.10 Data Encryption

#### 9.10.1 Encryption at Rest

- **Database Encryption**: Enable database encryption for sensitive data
- **Backup Encryption**: Encrypt all database backups
- **Key Management**: Use secure key management service (AWS KMS, Azure Key Vault)

#### 9.10.2 Encryption in Transit

- **TLS/SSL**: All data transmitted over HTTPS
- **Internal Services**: Use TLS for internal service-to-service communication

### 9.11 Vulnerability Management

#### 9.11.1 Security Scanning

- **Dependency Scanning**: Regular scanning for vulnerable dependencies
- **SAST**: Static Application Security Testing in CI/CD pipeline
- **DAST**: Dynamic Application Security Testing on staging environment
- **Penetration Testing**: Annual third-party penetration testing

#### 9.11.2 Security Updates

- **Patch Management**: Apply security patches within 30 days of release
- **Dependency Updates**: Keep dependencies up-to-date
- **Security Advisories**: Monitor security advisories for used libraries

### 9.12 Compliance Alignment

#### 9.12.1 OWASP Top 10 Mitigation

| **OWASP Risk** | **Mitigation** |
|----------------|----------------|
| A01: Broken Access Control | RBAC, permission checks, resource ownership validation |
| A02: Cryptographic Failures | TLS 1.2+, Argon2id/bcrypt, encryption at rest |
| A03: Injection | Parameterized queries, input validation, HTML sanitization |
| A04: Insecure Design | Security by design, threat modeling, least privilege |
| A05: Security Misconfiguration | Security headers, HTTPS only, secure defaults |
| A06: Vulnerable Components | Dependency scanning, regular updates |
| A07: Authentication Failures | JWT tokens, rate limiting, account lockout (User Login BRD) |
| A08: Software and Data Integrity | Code signing, audit logging, immutable logs |
| A09: Security Logging Failures | Comprehensive audit logging, log retention |
| A10: Server-Side Request Forgery | Input validation, URL whitelist |

#### 9.12.2 User Login BRD Alignment

- **Authentication**: JWT bearer tokens (aligned with User Login BRD)
- **Session Management**: 24-hour token expiration, refresh token support
- **Password Security**: Argon2id/bcrypt hashing (per User Login BRD)
- **Account Lockout**: Inherited from User Login system
- **Audit Logging**: Consistent with User Login audit requirements
- **RBAC**: Extends User Login role system with FAQ-specific permissions




---

## 10. Performance Considerations

### 10.1 Database Optimization

#### 10.1.1 Indexing Strategy

**Required Indexes**:

```sql
-- FAQs table
CREATE INDEX idx_faqs_category_id ON faqs(category_id);
CREATE INDEX idx_faqs_status ON faqs(status);
CREATE INDEX idx_faqs_created_at ON faqs(created_at);
CREATE INDEX idx_faqs_display_order ON faqs(display_order);
CREATE INDEX idx_faqs_view_count ON faqs(view_count);

-- Composite indexes for common queries
CREATE INDEX idx_faqs_category_status ON faqs(category_id, status);
CREATE INDEX idx_faqs_status_display_order ON faqs(status, display_order);

-- Full-text search index
CREATE FULLTEXT INDEX idx_faqs_search ON faqs(question, answer);

-- Categories table
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Tags table
CREATE UNIQUE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count);

-- FAQ-Tag junction table
CREATE INDEX idx_faq_tags_faq_id ON faq_tags(faq_id);
CREATE INDEX idx_faq_tags_tag_id ON faq_tags(tag_id);
```

#### 10.1.2 Query Optimization

**Efficient Queries**:
- Use `SELECT` with specific columns instead of `SELECT *`
- Implement pagination to limit result sets
- Use `LIMIT` and `OFFSET` for pagination
- Avoid N+1 queries by using JOINs or eager loading
- Use database query explain plans to identify slow queries

**Example Optimized Query**:
```sql
-- Efficient: Select only needed columns with JOIN
SELECT 
  f.id, f.question, f.category_id, f.status, f.view_count,
  c.name as category_name, c.slug as category_slug
FROM faqs f
INNER JOIN categories c ON f.category_id = c.id
WHERE f.status = 'published'
ORDER BY f.display_order ASC
LIMIT 20 OFFSET 0;

-- Inefficient: Select all columns with separate queries
SELECT * FROM faqs WHERE status = 'published';
-- Then for each FAQ: SELECT * FROM categories WHERE id = ?
```

#### 10.1.3 Connection Pooling

- **Pool Size**: Configure appropriate connection pool size (e.g., 10-50 connections)
- **Connection Timeout**: Set reasonable timeout (e.g., 30 seconds)
- **Idle Timeout**: Close idle connections after timeout (e.g., 10 minutes)
- **Max Lifetime**: Recycle connections periodically (e.g., 30 minutes)

### 10.2 Caching Strategy

#### 10.2.1 Redis Caching

**Cache Configuration**:
- **Cache Store**: Redis for distributed caching
- **TTL**: 5 minutes for published FAQs
- **Invalidation**: Cache invalidation on create/update/delete operations

**Cached Endpoints**:

| **Endpoint** | **Cache Key** | **TTL** | **Invalidation Trigger** |
|--------------|---------------|---------|--------------------------|
| `GET /api/v1/faqs` | `faqs:list:{params_hash}` | 5 minutes | FAQ create/update/delete |
| `GET /api/v1/faqs/:id` | `faqs:single:{id}` | 5 minutes | FAQ update/delete |
| `GET /api/v1/faq-categories` | `categories:list:{params_hash}` | 10 minutes | Category create/update/delete |

**Cache Key Examples**:
```
faqs:list:page=1&limit=20&status=published
faqs:single:550e8400-e29b-41d4-a716-446655440000
categories:list:nested=true
```

#### 10.2.2 Cache Invalidation

**Strategies**:
1. **Time-based**: Automatic expiration after TTL
2. **Event-based**: Invalidate on create/update/delete operations
3. **Pattern-based**: Invalidate all related cache keys using patterns

**Invalidation Example**:
```javascript
// On FAQ update
await redis.del(`faqs:single:${faqId}`);
await redis.del('faqs:list:*'); // Invalidate all list caches

// On category update
await redis.del(`categories:single:${categoryId}`);
await redis.del('categories:list:*');
await redis.del('faqs:list:*'); // FAQs include category data
```

#### 10.2.3 Cache-Control Headers

```http
Cache-Control: public, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 26 Jan 2025 14:30:00 GMT
```

- **Public Endpoints**: `Cache-Control: public, max-age=300` (5 minutes)
- **Authenticated Endpoints**: `Cache-Control: private, max-age=60` (1 minute)
- **Dynamic Content**: Use ETags for conditional requests

### 10.3 Response Optimization

#### 10.3.1 Lazy Loading

**List View Optimization**:
- Return truncated `answer` field in list endpoints (first 200 characters)
- Full `answer` available in single FAQ endpoint
- Reduces payload size by ~70% for list responses

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "question": "How do I reset my password?",
  "answer_preview": "To reset your password, click the 'Forgot Password' link on the login page. You will receive an email with instructions...",
  "answer_full_available": true
}
```

#### 10.3.2 Compression

- **Gzip Compression**: Enable gzip compression for all responses
- **Compression Level**: Level 6 (balance between speed and compression ratio)
- **Minimum Size**: Compress responses larger than 1KB

**Response Headers**:
```http
Content-Encoding: gzip
Vary: Accept-Encoding
```

#### 10.3.3 Pagination Optimization

- **Default Limit**: 20 items per page (balance between UX and performance)
- **Maximum Limit**: 100 items per page (prevent excessive data transfer)
- **Cursor-based Pagination**: Consider for large datasets (future enhancement)

### 10.4 Full-Text Search Optimization

#### 10.4.1 Search Indexing

**Database Full-Text Index**:
```sql
CREATE FULLTEXT INDEX idx_faqs_search ON faqs(question, answer);
```

**Search Query Optimization**:
```sql
-- Efficient full-text search
SELECT id, question, answer, 
       MATCH(question, answer) AGAINST('password reset' IN NATURAL LANGUAGE MODE) as relevance
FROM faqs
WHERE MATCH(question, answer) AGAINST('password reset' IN NATURAL LANGUAGE MODE)
  AND status = 'published'
ORDER BY relevance DESC
LIMIT 20;
```

#### 10.4.2 Search Performance

- **Relevance Ranking**: Use database full-text search relevance scoring
- **Result Limiting**: Always limit search results (max 100)
- **Search Caching**: Cache popular search queries
- **Minimum Query Length**: Require minimum 2 characters for search

#### 10.4.3 Advanced Search (Future Enhancement)

Consider Elasticsearch or similar for:
- Advanced search features (fuzzy matching, synonyms)
- Better performance for large datasets (>100,000 FAQs)
- Real-time search suggestions
- Search analytics

### 10.5 API Response Time Targets

| **Endpoint** | **Target (p50)** | **Target (p95)** | **Target (p99)** |
|--------------|------------------|------------------|------------------|
| `GET /api/v1/faqs` (cached) | < 50ms | < 100ms | < 200ms |
| `GET /api/v1/faqs` (uncached) | < 200ms | < 500ms | < 1000ms |
| `GET /api/v1/faqs/:id` (cached) | < 30ms | < 50ms | < 100ms |
| `GET /api/v1/faqs/:id` (uncached) | < 100ms | < 200ms | < 500ms |
| `POST /api/v1/faqs` | < 300ms | < 600ms | < 1000ms |
| `PUT /api/v1/faqs/:id` | < 300ms | < 600ms | < 1000ms |
| `DELETE /api/v1/faqs/:id` | < 200ms | < 400ms | < 800ms |

### 10.6 Scalability Considerations

#### 10.6.1 Horizontal Scaling

- **Stateless API**: Design API to be stateless for easy horizontal scaling
- **Load Balancing**: Use load balancer to distribute traffic across multiple instances
- **Session Storage**: Store sessions in Redis (not in-memory)
- **Database Read Replicas**: Use read replicas for GET requests

#### 10.6.2 Database Scaling

- **Read Replicas**: Route read queries to replicas
- **Write Master**: Route write queries to master database
- **Connection Pooling**: Implement connection pooling for efficient resource usage
- **Sharding**: Consider sharding for very large datasets (future)

#### 10.6.3 CDN Integration

- **Static Assets**: Serve static assets via CDN
- **API Caching**: Consider CDN caching for public GET endpoints
- **Geographic Distribution**: Use CDN for global content delivery

### 10.7 Monitoring & Performance Metrics

#### 10.7.1 Key Metrics

- **Response Time**: p50, p95, p99 latencies
- **Throughput**: Requests per second
- **Error Rate**: 4xx and 5xx error percentages
- **Cache Hit Rate**: Percentage of requests served from cache
- **Database Query Time**: Average and p95 query execution time
- **Connection Pool Usage**: Active vs. idle connections

#### 10.7.2 Monitoring Tools

- **APM**: Application Performance Monitoring (New Relic, Datadog, etc.)
- **Logging**: Structured logging with request IDs for tracing
- **Alerting**: Set up alerts for performance degradation
- **Dashboards**: Real-time dashboards for key metrics

#### 10.7.3 Performance Testing

- **Load Testing**: Regular load testing to identify bottlenecks
- **Stress Testing**: Test system behavior under extreme load
- **Capacity Planning**: Plan for 3x expected peak load
- **Continuous Monitoring**: Monitor performance in production




---

## 11. Compliance & Data Protection

### 11.1 GDPR Compliance

#### 11.1.1 Data Protection Principles

**Alignment with User Login BRD GDPR requirements**:

| **Principle** | **Implementation** |
|---------------|-------------------|
| **Lawfulness, Fairness, Transparency** | Clear privacy policy, user consent for data collection |
| **Purpose Limitation** | FAQ data used only for content management and display |
| **Data Minimization** | Collect only necessary data (no PII in FAQ content) |
| **Accuracy** | Allow users to update/correct FAQ content (admin only) |
| **Storage Limitation** | Audit logs retained for 2 years, then deleted |
| **Integrity & Confidentiality** | Encryption at rest and in transit, access controls |
| **Accountability** | Comprehensive audit logging, data protection impact assessment |

#### 11.1.2 User Rights

| **Right** | **Implementation** |
|-----------|-------------------|
| **Right to Access** | Admin users can export all FAQ data via API |
| **Right to Rectification** | Admin users can update FAQ content via PUT endpoint |
| **Right to Erasure** | Soft delete (archive) for audit trail, hard delete after retention period |
| **Right to Data Portability** | Export FAQ data in JSON format |
| **Right to Object** | Users can request removal of specific content |

#### 11.1.3 Data Export

**Export Endpoint** (Admin only):
```http
GET /api/v1/faqs/export?format=json
Authorization: Bearer <JWT_TOKEN>
```

**Export Response**:
```json
{
  "success": true,
  "data": {
    "export_id": "exp_abc123xyz",
    "created_at": "2025-01-26T15:00:00Z",
    "faqs": [...],
    "categories": [...],
    "tags": [...]
  }
}
```

#### 11.1.4 Data Retention

| **Data Type** | **Retention Period** | **Deletion Method** |
|---------------|---------------------|---------------------|
| **Published FAQs** | Indefinite (until archived) | Soft delete (archive status) |
| **Archived FAQs** | 2 years | Hard delete after retention period |
| **Audit Logs** | 2 years | Automatic deletion after retention period |
| **User Sessions** | 24 hours | Automatic expiration |
| **Cache Data** | 5-10 minutes | Automatic expiration |

### 11.2 CCPA Compliance

#### 11.2.1 Privacy Rights

**Alignment with User Login BRD CCPA requirements**:

| **Right** | **Implementation** |
|-----------|-------------------|
| **Right to Know** | Provide transparency about data collection and usage |
| **Right to Delete** | Soft delete with 2-year retention for compliance |
| **Right to Opt-Out** | No sale of personal data (not applicable to FAQ content) |
| **Right to Non-Discrimination** | Equal service regardless of privacy choices |

#### 11.2.2 Privacy Notice

**Required Disclosures**:
- Categories of personal information collected (user_id, IP address in audit logs)
- Purpose of data collection (content management, security, audit)
- Data retention periods (2 years for audit logs)
- Third-party data sharing (none for FAQ content)

#### 11.2.3 Data Subject Requests

**Request Processing**:
- **Request Verification**: Verify identity before processing requests
- **Response Timeline**: Respond within 45 days (CCPA requirement)
- **Request Types**: Access, deletion, opt-out
- **Request Logging**: Log all data subject requests for compliance

### 11.3 Data Protection Measures

#### 11.3.1 No PII in FAQ Content

**Policy**: FAQ content MUST NOT contain personally identifiable information (PII)

**Prohibited Data**:
- Names, email addresses, phone numbers
- Social security numbers, passport numbers
- Credit card numbers, bank account details
- IP addresses, device identifiers
- Health information, biometric data

**Validation**: Implement automated PII detection and blocking during FAQ creation/update

#### 11.3.2 Anonymization

**Audit Logs**:
- User IDs stored as references (not full user details)
- IP addresses can be anonymized (last octet masked) after 90 days
- User agent strings stored for security analysis

**Example Anonymized IP**:
```
Original: 192.168.1.100
Anonymized: 192.168.1.0
```

#### 11.3.3 Data Breach Response

**Incident Response Plan**:
1. **Detection**: Automated monitoring and alerting
2. **Containment**: Isolate affected systems
3. **Assessment**: Determine scope and impact
4. **Notification**: Notify affected users within 72 hours (GDPR requirement)
5. **Remediation**: Fix vulnerabilities and restore service
6. **Documentation**: Document incident for compliance

### 11.4 Audit Trail & Compliance Reporting

#### 11.4.1 Audit Log Requirements

**Logged Events** (aligned with User Login BRD):
- All create, update, delete operations
- User authentication events (via User Login system)
- Permission changes
- Data export requests
- Failed authorization attempts

**Audit Log Fields**:
```json
{
  "event_id": "evt_abc123xyz",
  "timestamp": "2025-01-26T14:30:00Z",
  "user_id": "770e8400-e29b-41d4-a716-446655440002",
  "action": "faq:update",
  "resource_type": "faq",
  "resource_id": "550e8400-e29b-41d4-a716-446655440000",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "changes": {...},
  "request_id": "req_abc123xyz"
}
```

#### 11.4.2 Compliance Reporting

**Available Reports**:
- **Access Report**: All data access events for specific user/resource
- **Modification Report**: All create/update/delete operations
- **Export Report**: All data export requests
- **Deletion Report**: All soft/hard delete operations

**Report Generation**:
```http
GET /api/v1/admin/compliance/reports?type=access&start_date=2025-01-01&end_date=2025-01-31
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### 11.4.3 Audit Log Retention

- **Retention Period**: 2 years minimum (GDPR/CCPA requirement)
- **Storage**: Separate audit database with restricted access
- **Immutability**: Audit logs cannot be modified or deleted
- **Backup**: Regular backups with encryption
- **Access Control**: Only security and compliance teams can access

### 11.5 Third-Party Data Processing

#### 11.5.1 Data Processors

**Approved Processors**:
- **Cloud Provider**: AWS/Azure/GCP for hosting
- **CDN Provider**: CloudFlare/Akamai for content delivery
- **Monitoring Service**: Datadog/New Relic for APM
- **Email Service**: SendGrid/AWS SES for notifications

**Requirements**:
- Data Processing Agreement (DPA) in place
- GDPR/CCPA compliance certification
- Regular security audits
- Data residency compliance (EU data stays in EU)

#### 11.5.2 Data Transfer

**International Transfers**:
- **EU-US**: Standard Contractual Clauses (SCC) or Privacy Shield successor
- **Data Residency**: Store EU user data in EU data centers
- **Encryption**: All data encrypted in transit and at rest

### 11.6 Soft Delete Implementation

#### 11.6.1 Soft Delete Process

**Delete Operation**:
1. Change FAQ status to `archived`
2. Set `deleted_at` timestamp
3. Record `deleted_by` user ID
4. Preserve all data for audit trail
5. Hide from public API responses

**Database Schema**:
```sql
ALTER TABLE faqs ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE faqs ADD COLUMN deleted_by UUID NULL;
```

#### 11.6.2 Hard Delete Process

**Automatic Hard Delete**:
- Runs daily via scheduled job
- Deletes FAQs where `deleted_at` > 2 years ago
- Logs hard delete operations in audit log
- Irreversible operation

**Manual Hard Delete** (Admin only, exceptional cases):
```http
DELETE /api/v1/admin/faqs/:id/hard-delete
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

### 11.7 Compliance Checklist

#### 11.7.1 Pre-Launch Checklist

- [ ] Privacy policy updated with FAQ data collection details
- [ ] GDPR data protection impact assessment completed
- [ ] CCPA privacy notice published
- [ ] Data retention policies documented
- [ ] Audit logging implemented and tested
- [ ] Soft delete functionality implemented
- [ ] Data export functionality implemented
- [ ] PII detection and blocking implemented
- [ ] Security headers configured
- [ ] Encryption at rest and in transit enabled
- [ ] Access controls and RBAC implemented
- [ ] Rate limiting configured
- [ ] Incident response plan documented
- [ ] Data Processing Agreements signed with third parties
- [ ] Compliance training completed for team

#### 11.7.2 Ongoing Compliance

- [ ] Quarterly security audits
- [ ] Annual penetration testing
- [ ] Regular dependency updates
- [ ] Audit log review (monthly)
- [ ] Compliance report generation (quarterly)
- [ ] Data retention policy enforcement (automated)
- [ ] Privacy policy updates (as needed)
- [ ] Staff compliance training (annual)




---

## 12. Appendix

### 12.1 API Endpoint Summary

#### 12.1.1 FAQ Endpoints

| **Method** | **Endpoint** | **Auth Required** | **Permissions** | **Description** |
|------------|--------------|-------------------|-----------------|-----------------|
| GET | `/api/v1/faqs` | No* | - | List all FAQs (published only for public) |
| GET | `/api/v1/faqs/:id` | No* | - | Get single FAQ (published only for public) |
| POST | `/api/v1/faqs` | Yes | `faq:create` | Create new FAQ |
| PUT | `/api/v1/faqs/:id` | Yes | `faq:update` | Update existing FAQ |
| DELETE | `/api/v1/faqs/:id` | Yes | `faq:delete` | Soft delete FAQ (archive) |

*Optional authentication - authenticated users with proper permissions can see draft/archived FAQs

#### 12.1.2 Category Endpoints

| **Method** | **Endpoint** | **Auth Required** | **Permissions** | **Description** |
|------------|--------------|-------------------|-----------------|-----------------|
| GET | `/api/v1/faq-categories` | No | - | List all categories |
| GET | `/api/v1/faq-categories/:id` | No | - | Get single category |
| POST | `/api/v1/faq-categories` | Yes | `category:manage` | Create new category |
| PUT | `/api/v1/faq-categories/:id` | Yes | `category:manage` | Update existing category |
| DELETE | `/api/v1/faq-categories/:id` | Yes | `category:manage` | Delete category (if no FAQs) |

#### 12.1.3 Admin Endpoints (Future)

| **Method** | **Endpoint** | **Auth Required** | **Permissions** | **Description** |
|------------|--------------|-------------------|-----------------|-----------------|
| GET | `/api/v1/admin/faqs/export` | Yes | `admin` | Export all FAQ data |
| DELETE | `/api/v1/admin/faqs/:id/hard-delete` | Yes | `admin` | Permanently delete FAQ |
| GET | `/api/v1/admin/compliance/reports` | Yes | `admin` | Generate compliance reports |

### 12.2 HTTP Status Code Reference

| **Status Code** | **Name** | **When to Use** |
|-----------------|----------|-----------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful operation with no response body |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource or constraint violation |
| 422 | Unprocessable Entity | Valid request but business logic prevents processing |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Temporary service outage |

### 12.3 Common Query Parameter Patterns

#### 12.3.1 Pagination

```
?page=1&limit=20
```

#### 12.3.2 Filtering

```
?category=<uuid>&tags=tag1,tag2&status=published
```

#### 12.3.3 Searching

```
?q=search+term
```

#### 12.3.4 Sorting

```
?sort=created_at&order=desc
```

#### 12.3.5 Combined Example

```
?page=2&limit=50&category=660e8400-e29b-41d4-a716-446655440001&tags=password,security&q=reset&sort=view_count&order=desc
```

### 12.4 Sample Request/Response Examples

#### 12.4.1 Create FAQ with Full Workflow

**Step 1: Create Draft FAQ**

```http
POST /api/v1/faqs
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "question": "How do I enable two-factor authentication?",
  "answer": "<p>To enable 2FA, go to Settings > Security and follow the instructions.</p>",
  "category_id": "660e8400-e29b-41d4-a716-446655440001",
  "tags": ["security", "2fa"],
  "status": "draft"
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "question": "How do I enable two-factor authentication?",
    "answer": "<p>To enable 2FA, go to Settings > Security and follow the instructions.</p>",
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "tags": ["security", "2fa"],
    "status": "draft",
    "created_at": "2025-01-26T16:00:00Z",
    "updated_at": "2025-01-26T16:00:00Z",
    "created_by": "770e8400-e29b-41d4-a716-446655440002",
    "updated_by": "770e8400-e29b-41d4-a716-446655440002",
    "view_count": 0,
    "display_order": 0
  }
}
```

**Step 2: Update to Published**

```http
PUT /api/v1/faqs/990e8400-e29b-41d4-a716-446655440005
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "status": "published"
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "status": "published",
    "updated_at": "2025-01-26T16:05:00Z"
  }
}
```

#### 12.4.2 Search and Filter FAQs

**Request**:

```http
GET /api/v1/faqs?q=password&category=660e8400-e29b-41d4-a716-446655440001&tags=security&page=1&limit=10&sort=view_count&order=desc
Host: api.example.com
Accept: application/json
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "question": "How do I reset my password?",
      "answer": "<p>To reset your password, click the 'Forgot Password' link...</p>",
      "category_id": "660e8400-e29b-41d4-a716-446655440001",
      "category": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Account Management",
        "slug": "account-management"
      },
      "tags": ["password", "security", "account"],
      "status": "published",
      "view_count": 1523,
      "display_order": 1
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

#### 12.4.3 Create Nested Category

**Request**:

```http
POST /api/v1/faq-categories
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Password Reset",
  "description": "Questions about resetting passwords",
  "parent_id": "660e8400-e29b-41d4-a716-446655440001",
  "display_order": 1
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "name": "Password Reset",
    "slug": "password-reset",
    "description": "Questions about resetting passwords",
    "parent_id": "660e8400-e29b-41d4-a716-446655440001",
    "display_order": 1,
    "created_at": "2025-01-26T16:10:00Z",
    "updated_at": "2025-01-26T16:10:00Z"
  }
}
```

### 12.5 Error Handling Examples

#### 12.5.1 Validation Error

**Request**:

```http
POST /api/v1/faqs
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "question": "Short",
  "answer": "Too short",
  "category_id": "invalid-uuid"
}
```

**Response (400 Bad Request)**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed. Please check the details.",
    "details": [
      {
        "field": "question",
        "message": "Question must be at least 10 characters",
        "value": "Short"
      },
      {
        "field": "answer",
        "message": "Answer must be at least 20 characters",
        "value": "Too short"
      },
      {
        "field": "category_id",
        "message": "Category ID must be a valid UUID",
        "value": "invalid-uuid"
      }
    ]
  }
}
```

#### 12.5.2 Authorization Error

**Request**:

```http
POST /api/v1/faqs
Content-Type: application/json
Authorization: Bearer <VIEWER_TOKEN>

{
  "question": "How do I enable two-factor authentication?",
  "answer": "<p>To enable 2FA...</p>",
  "category_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response (403 Forbidden)**:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to perform this action.",
    "details": [
      {
        "required_permission": "faq:create",
        "user_permissions": ["faq:read"],
        "user_roles": ["viewer"]
      }
    ]
  }
}
```

### 12.6 Database Schema

#### 12.6.1 FAQs Table

```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID NOT NULL REFERENCES users(id),
  view_count INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMP NULL,
  deleted_by UUID NULL REFERENCES users(id),
  
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_display_order (display_order),
  INDEX idx_view_count (view_count),
  FULLTEXT INDEX idx_search (question, answer)
);
```

#### 12.6.2 Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  parent_id UUID NULL REFERENCES categories(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id),
  INDEX idx_display_order (display_order)
);
```

#### 12.6.3 Tags Table

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  
  UNIQUE INDEX idx_slug (slug),
  INDEX idx_usage_count (usage_count)
);
```

#### 12.6.4 FAQ-Tag Junction Table

```sql
CREATE TABLE faq_tags (
  faq_id UUID NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (faq_id, tag_id),
  INDEX idx_faq_id (faq_id),
  INDEX idx_tag_id (tag_id)
);
```

### 12.7 Glossary

| **Term** | **Definition** |
|----------|---------------|
| **API** | Application Programming Interface - set of protocols for building software |
| **CORS** | Cross-Origin Resource Sharing - mechanism for allowing restricted resources |
| **CSRF** | Cross-Site Request Forgery - type of malicious exploit |
| **JWT** | JSON Web Token - compact token format for authentication |
| **RBAC** | Role-Based Access Control - access control based on user roles |
| **REST** | Representational State Transfer - architectural style for APIs |
| **Slug** | URL-friendly identifier (e.g., "account-management") |
| **Soft Delete** | Marking record as deleted without removing from database |
| **Hard Delete** | Permanently removing record from database |
| **UUID** | Universally Unique Identifier - 128-bit identifier |
| **XSS** | Cross-Site Scripting - type of security vulnerability |
| **2FA/MFA** | Two-Factor/Multi-Factor Authentication |
| **GDPR** | General Data Protection Regulation - EU privacy law |
| **CCPA** | California Consumer Privacy Act - California privacy law |
| **OWASP** | Open Web Application Security Project |
| **PII** | Personally Identifiable Information |
| **TTL** | Time To Live - cache expiration time |

### 12.8 Change Log

| **Version** | **Date** | **Changes** | **Author** |
|-------------|----------|-------------|------------|
| 1.0 | 2025-01-26 | Initial API specification | API Development Team |

### 12.9 References

- **User Login BRD**: Authentication and authorization framework
- **OWASP API Security Top 10**: https://owasp.org/www-project-api-security/
- **REST API Best Practices**: https://restfulapi.net/
- **GDPR Official Text**: https://gdpr-info.eu/
- **CCPA Official Text**: https://oag.ca.gov/privacy/ccpa
- **JWT Specification**: https://tools.ietf.org/html/rfc7519
- **HTTP Status Codes**: https://httpstatuses.com/

---

## Document Approval

| **Role** | **Name** | **Signature** | **Date** |
|----------|----------|---------------|----------|
| **API Lead** | _______________ | _______________ | _______________ |
| **Security Lead** | _______________ | _______________ | _______________ |
| **Product Manager** | _______________ | _______________ | _______________ |
| **Compliance Officer** | _______________ | _______________ | _______________ |

---

**End of Document**


