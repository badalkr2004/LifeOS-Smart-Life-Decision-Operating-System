# LifeOS Backend — API Testing Reference

> **Base URL:** `http://localhost:3000` (dev) | `https://api.lifeos.app` (prod)
> **API Prefix:** `/api/v1`
> **Auth:** JWT Bearer token required on all routes except `/health`, `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`

---

## Table of Contents

1. [Health Check](#1-health-check)
2. [Authentication](#2-authentication)
3. [Users](#3-users)
4. [Decisions](#4-decisions)
5. [Outcomes & Check-ins](#5-outcomes--check-ins)
6. [Analytics](#6-analytics)
7. [AI Engine](#7-ai-engine)
8. [Notifications](#8-notifications)
9. [Decision Frameworks](#9-decision-frameworks)
10. [Decision Templates](#10-decision-templates)
11. [Enum Reference](#11-enum-reference)
12. [Common Error Responses](#12-common-error-responses)

---

## 1. Health Check

### `GET /health`

No auth required.

**Response `200 OK`**
```json
{
  "status": "ok",
  "timestamp": "2026-03-28T17:00:00.000Z"
}
```

---

## 2. Authentication

### 2.1 Register

`POST /api/v1/auth/register`

**Request Body**
```json
{
  "email": "jane@example.com",
  "password": "SecureP@ssword123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | YES |
| `password` | string | YES |
| `firstName` | string | NO |
| `lastName` | string | NO |

**Response `201 Created`**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "displayName": "Jane Doe",
    "role": "user",
    "status": "active",
    "emailVerified": false,
    "timezone": "UTC",
    "locale": "en-US",
    "createdAt": "2026-03-28T17:00:00.000Z",
    "updatedAt": "2026-03-28T17:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
}
```

**Error `409`** `{ "error": "User already exists" }`
**Error `400`** `{ "error": "Email and password are required" }`

---

### 2.2 Login

`POST /api/v1/auth/login`

**Request Body**
```json
{
  "email": "jane@example.com",
  "password": "SecureP@ssword123"
}
```

**Response `200 OK`**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane@example.com",
    "role": "user",
    "lastLoginAt": "2026-03-28T17:05:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9..."
}
```

**Error `401`** `{ "error": "Invalid credentials" }`

---

### 2.3 Refresh Access Token

`POST /api/v1/auth/refresh`

Revokes old refresh token and issues a new pair.

**Request Body**
```json
{
  "refreshToken": "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9..."
}
```

**Response `200 OK`**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0..."
}
```

**Error `401`** `{ "error": "Invalid or expired refresh token" }`

---

### 2.4 Logout

`POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body**
```json
{
  "refreshToken": "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9..."
}
```

**Response `200 OK`**
```json
{ "message": "Logged out successfully" }
```

---

## 3. Users

> All routes: `Authorization: Bearer <accessToken>`

### 3.1 Get Current User

`GET /api/v1/users/me`

**Response `200 OK`**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "displayName": "Jane Doe",
    "avatarUrl": null,
    "role": "user",
    "status": "active",
    "emailVerified": false,
    "timezone": "UTC",
    "locale": "en-US",
    "lastLoginAt": "2026-03-28T17:05:00.000Z",
    "createdAt": "2026-03-28T17:00:00.000Z",
    "updatedAt": "2026-03-28T17:05:00.000Z"
  }
}
```

---

### 3.2 Update Current User

`PATCH /api/v1/users/me`

**Request Body** (all optional)
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "displayName": "Jane Smith",
  "timezone": "America/New_York",
  "locale": "en-US"
}
```

**Response `200 OK`**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Jane",
    "lastName": "Smith",
    "displayName": "Jane Smith",
    "timezone": "America/New_York",
    "updatedAt": "2026-03-28T18:00:00.000Z"
  }
}
```

---

### 3.3 Delete Account (Soft Delete)

`DELETE /api/v1/users/me`

Sets `status = "deleted"`. Does not hard-delete.

**Response `200 OK`**
```json
{ "message": "Account deleted successfully" }
```

---

### 3.4 Get User Profile

`GET /api/v1/users/me/profile`

**Response `200 OK`** (profile exists)
```json
{
  "profile": {
    "id": "661e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "bio": "Software engineer passionate about life optimization.",
    "occupation": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "dateOfBirth": "1990-06-15T00:00:00.000Z",
    "defaultCheckInIntervals": ["1_week", "1_month", "6_months"],
    "notificationPreferences": {
      "email": true,
      "push": true,
      "sms": false,
      "frequency": "weekly"
    },
    "privacySettings": {
      "shareAnonymousData": true,
      "allowAITraining": false,
      "publicProfile": false
    },
    "createdAt": "2026-03-28T17:00:00.000Z",
    "updatedAt": "2026-03-28T17:00:00.000Z"
  }
}
```

**Response `200 OK`** (no profile yet — returns defaults)
```json
{
  "profile": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "bio": null,
    "occupation": null,
    "location": null,
    "dateOfBirth": null,
    "notificationPreferences": null,
    "privacySettings": null
  }
}
```

---

### 3.5 Update (Upsert) User Profile

`PUT /api/v1/users/me/profile`

Creates or fully replaces the profile.

**Request Body** (all optional)
```json
{
  "bio": "Software engineer passionate about life optimization.",
  "occupation": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "dateOfBirth": "1990-06-15",
  "defaultCheckInIntervals": ["1_week", "1_month", "6_months"],
  "notificationPreferences": {
    "email": true,
    "push": true,
    "sms": false,
    "frequency": "weekly"
  },
  "privacySettings": {
    "shareAnonymousData": true,
    "allowAITraining": false,
    "publicProfile": false
  }
}
```

**Response `200 OK`**
```json
{
  "profile": {
    "id": "661e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "bio": "Software engineer passionate about life optimization.",
    "occupation": "Senior Software Engineer",
    "updatedAt": "2026-03-28T18:30:00.000Z"
  }
}
```

---

## 4. Decisions

> All routes: `Authorization: Bearer <accessToken>`

### 4.1 List Decisions

`GET /api/v1/decisions`

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Max 100 |
| `category` | string | — | Filter by category |
| `status` | string | — | Filter by status |
| `sortBy` | string | `decisionDate` | `decisionDate`, `createdAt`, `title` |
| `sortOrder` | string | `desc` | `asc` or `desc` |

**Example**
```
GET /api/v1/decisions?page=1&limit=10&category=career&status=active&sortBy=decisionDate&sortOrder=desc
```

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "771e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Accept senior engineering role at TechCorp",
      "description": "Evaluating a job offer with 40% salary increase.",
      "category": "career",
      "subcategory": "job_change",
      "status": "active",
      "decisionDate": "2026-03-01T00:00:00.000Z",
      "expectedOutcomeDate": "2026-09-01T00:00:00.000Z",
      "context": "Currently at OldCo, feeling limited in growth.",
      "reasoningProcess": "Used pro/con analysis.",
      "alternativesConsidered": [
        {
          "option": "Stay at OldCo",
          "prosAndCons": {
            "pros": ["Job security", "Familiar team"],
            "cons": ["No salary increase", "Limited growth"]
          },
          "whyNotChosen": "Growth ceiling too low"
        }
      ],
      "expectedOutcomes": [
        {
          "outcome": "Salary increase",
          "metric": "annual_salary",
          "targetValue": 140000,
          "timeframe": "immediate",
          "importance": 4
        }
      ],
      "confidenceLevel": 8,
      "frameworkUsed": "Pro/Con Analysis",
      "tags": ["career", "salary", "growth"],
      "isPrivate": true,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 4.2 Get Single Decision

`GET /api/v1/decisions/:id`

**Response `200 OK`**
```json
{
  "data": {
    "id": "771e8400-e29b-41d4-a716-446655440002",
    "title": "Accept senior engineering role at TechCorp",
    "category": "career",
    "status": "active",
    "confidenceLevel": 8,
    "createdAt": "2026-03-01T10:00:00.000Z"
  }
}
```

**Error `404`** `{ "error": "Decision not found" }`

---

### 4.3 Create Decision

`POST /api/v1/decisions`

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | YES | Max 255 chars |
| `category` | string | NO | Defaults to `"other"` |
| `status` | string | NO | Defaults to `"active"` |
| `description` | string | NO | |
| `context` | string | NO | Background info |
| `reasoningProcess` | string | NO | |
| `alternativesConsidered` | array | NO | |
| `expectedOutcomes` | array | NO | Defaults to `[]` |
| `confidenceLevel` | number | NO | 1–10, defaults to `5` |
| `frameworkUsed` | string | NO | |
| `tags` | string[] | NO | |
| `isPrivate` | boolean | NO | Defaults to `true` |
| `subcategory` | string | NO | |
| `expectedOutcomeDate` | ISO date | NO | |
| `parentDecisionId` | UUID | NO | Link to parent decision |

**Request Body Example**
```json
{
  "title": "Accept senior engineering role at TechCorp",
  "category": "career",
  "description": "40% salary increase offer.",
  "context": "Currently at OldCo, feeling limited in growth.",
  "reasoningProcess": "Used pro/con analysis.",
  "alternativesConsidered": [
    {
      "option": "Stay at OldCo",
      "prosAndCons": {
        "pros": ["Job security"],
        "cons": ["No growth"]
      },
      "whyNotChosen": "Growth ceiling too low"
    }
  ],
  "expectedOutcomes": [
    {
      "outcome": "Salary increase",
      "metric": "annual_salary",
      "targetValue": 140000,
      "timeframe": "immediate",
      "importance": 4
    }
  ],
  "confidenceLevel": 8,
  "frameworkUsed": "Pro/Con Analysis",
  "tags": ["career", "salary"],
  "isPrivate": true,
  "expectedOutcomeDate": "2026-09-01"
}
```

**Response `201 Created`**
```json
{
  "data": {
    "id": "771e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Accept senior engineering role at TechCorp",
    "category": "career",
    "status": "active",
    "confidenceLevel": 8,
    "createdAt": "2026-03-28T17:00:00.000Z",
    "updatedAt": "2026-03-28T17:00:00.000Z"
  }
}
```

**Error `400`** `{ "error": "Title is required" }`

---

### 4.4 Update Decision

`PATCH /api/v1/decisions/:id`

Updatable fields: `title`, `description`, `category`, `subcategory`, `status`, `context`, `reasoningProcess`, `alternativesConsidered`, `expectedOutcomes`, `confidenceLevel`, `frameworkUsed`, `tags`, `isPrivate`, `expectedOutcomeDate`.

**Request Body** (send only fields to update)
```json
{
  "status": "archived",
  "confidenceLevel": 9,
  "tags": ["career", "salary", "completed"]
}
```

**Response `200 OK`**
```json
{
  "data": {
    "id": "771e8400-e29b-41d4-a716-446655440002",
    "status": "archived",
    "confidenceLevel": 9,
    "tags": ["career", "salary", "completed"],
    "updatedAt": "2026-03-28T18:00:00.000Z"
  }
}
```

---

### 4.5 Delete Decision (Soft Delete)

`DELETE /api/v1/decisions/:id`

Sets `status = "deleted"`. Does not hard-delete.

**Response `204 No Content`**

---

## 5. Outcomes & Check-ins

> All routes: `Authorization: Bearer <accessToken>`

### 5.1 List Outcomes for a Decision

`GET /api/v1/outcomes?decision_id=<uuid>`

**Required Query Param:** `decision_id` (UUID)

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "881e8400-e29b-41d4-a716-446655440003",
      "decisionId": "771e8400-e29b-41d4-a716-446655440002",
      "checkInDate": "2026-04-01T00:00:00.000Z",
      "timeElapsedDays": 31,
      "satisfactionScore": 8,
      "wouldDecideAgain": true,
      "actualResults": "Joined TechCorp. Salary at $140k. Team is great.",
      "metrics": [
        {
          "metric": "annual_salary",
          "value": 140000,
          "unit": "USD",
          "vsExpected": "as_expected"
        }
      ],
      "reflections": "Transition was smooth.",
      "surprises": "Remote culture better than expected.",
      "lessonsLearned": "Should have asked for equity too.",
      "unintendedConsequences": [
        {
          "description": "Longer commute on office days",
          "impact": "negative",
          "severity": 2
        }
      ],
      "contextChanges": "Company announced remote-first policy.",
      "moodAtCheckIn": 8,
      "stressLevel": 5,
      "createdAt": "2026-04-01T10:00:00.000Z",
      "updatedAt": "2026-04-01T10:00:00.000Z"
    }
  ]
}
```

**Error `400`** `{ "error": "Missing required query parameter: decision_id" }`

---

### 5.2 Get Single Outcome

`GET /api/v1/outcomes/:id`

**Response `200 OK`**
```json
{
  "data": {
    "id": "881e8400-e29b-41d4-a716-446655440003",
    "decisionId": "771e8400-e29b-41d4-a716-446655440002",
    "satisfactionScore": 8,
    "actualResults": "Joined TechCorp. Salary at $140k.",
    "createdAt": "2026-04-01T10:00:00.000Z"
  }
}
```

---

### 5.3 Create Outcome

`POST /api/v1/outcomes`

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `decisionId` | UUID | YES | Must belong to calling user |
| `satisfactionScore` | number | YES | 1–10 |
| `actualResults` | string | YES | What happened |
| `metrics` | array | NO | Quantitative data |
| `reflections` | string | NO | |
| `surprises` | string | NO | |
| `lessonsLearned` | string | NO | |
| `unintendedConsequences` | array | NO | |
| `contextChanges` | string | NO | |
| `wouldDecideAgain` | boolean | NO | |
| `moodAtCheckIn` | number | NO | 1–10 |
| `stressLevel` | number | NO | 1–10 |

**Request Body Example**
```json
{
  "decisionId": "771e8400-e29b-41d4-a716-446655440002",
  "satisfactionScore": 8,
  "actualResults": "Joined TechCorp. Salary at $140k. Loving the work.",
  "metrics": [
    {
      "metric": "annual_salary",
      "value": 140000,
      "unit": "USD",
      "vsExpected": "as_expected"
    }
  ],
  "reflections": "Good decision overall.",
  "surprises": "Remote culture better than expected.",
  "lessonsLearned": "Should have negotiated equity.",
  "unintendedConsequences": [
    {
      "description": "Longer commute on office days",
      "impact": "negative",
      "severity": 2
    }
  ],
  "wouldDecideAgain": true,
  "moodAtCheckIn": 8,
  "stressLevel": 4
}
```

**Response `201 Created`**
```json
{
  "data": {
    "id": "881e8400-e29b-41d4-a716-446655440003",
    "decisionId": "771e8400-e29b-41d4-a716-446655440002",
    "satisfactionScore": 8,
    "timeElapsedDays": 27,
    "wouldDecideAgain": true,
    "createdAt": "2026-03-28T17:00:00.000Z"
  }
}
```

**Error `400`** `{ "error": "decisionId, satisfactionScore, and actualResults are required" }`

---

### 5.4 Update Outcome

`PATCH /api/v1/outcomes/:id`

**Request Body** (fields to change)
```json
{
  "satisfactionScore": 9,
  "reflections": "Updated: Even better after 3 months."
}
```

**Response `200 OK`**
```json
{
  "data": {
    "id": "881e8400-e29b-41d4-a716-446655440003",
    "satisfactionScore": 9,
    "reflections": "Updated: Even better after 3 months.",
    "updatedAt": "2026-03-28T18:00:00.000Z"
  }
}
```

---

### 5.5 Delete Outcome

`DELETE /api/v1/outcomes/:id`

**Response `204 No Content`**

---

### 5.6 Get Pending Check-ins

`GET /api/v1/outcomes/pending-checkins`

Returns all reminders with `status = "pending"` for the current user.

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "991e8400-e29b-41d4-a716-446655440004",
      "decisionId": "771e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "reminderType": "1_month",
      "scheduledDate": "2026-04-01T09:00:00.000Z",
      "status": "pending",
      "customMessage": null,
      "createdAt": "2026-03-01T10:00:00.000Z"
    }
  ]
}
```

---

### 5.7 Schedule Check-in

`POST /api/v1/outcomes/schedule-checkin`

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `decisionId` | UUID | YES | |
| `scheduledDate` | ISO date | YES | |
| `reminderType` | string | NO | Defaults to `"custom"` |
| `customMessage` | string | NO | |

**Request Body Example**
```json
{
  "decisionId": "771e8400-e29b-41d4-a716-446655440002",
  "scheduledDate": "2026-06-01T09:00:00.000Z",
  "reminderType": "3_months",
  "customMessage": "Time to check in on your TechCorp decision!"
}
```

**Response `201 Created`**
```json
{
  "data": {
    "id": "991e8400-e29b-41d4-a716-446655440005",
    "decisionId": "771e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "reminderType": "3_months",
    "scheduledDate": "2026-06-01T09:00:00.000Z",
    "status": "pending",
    "createdAt": "2026-03-28T17:00:00.000Z"
  }
}
```

---

### 5.8 Complete Check-in

`POST /api/v1/outcomes/checkins/:id/complete`

**Response `200 OK`**
```json
{
  "data": {
    "id": "991e8400-e29b-41d4-a716-446655440005",
    "status": "completed",
    "completedAt": "2026-06-01T10:30:00.000Z",
    "updatedAt": "2026-06-01T10:30:00.000Z"
  }
}
```

---

### 5.9 Skip Check-in

`POST /api/v1/outcomes/checkins/:id/skip`

**Response `200 OK`**
```json
{
  "data": {
    "id": "991e8400-e29b-41d4-a716-446655440005",
    "status": "skipped",
    "skippedAt": "2026-06-01T10:30:00.000Z",
    "updatedAt": "2026-06-01T10:30:00.000Z"
  }
}
```

---

## 6. Analytics

> All routes: `Authorization: Bearer <accessToken>`

### 6.1 Get Summary

`GET /api/v1/analytics/summary`

**Response `200 OK`**
```json
{
  "data": {
    "totalDecisions": 24,
    "averageConfidence": 7.2,
    "averageSatisfaction": 6.8,
    "pendingCheckins": 3,
    "totalOutcomes": 18,
    "topCategories": [
      { "category": "career", "count": 8 },
      { "category": "financial", "count": 6 },
      { "category": "health", "count": 5 }
    ]
  }
}
```

---

### 6.2 Get Patterns

`GET /api/v1/analytics/patterns`

**Query Params:** `?category=career` (optional)

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "aa1e8400-e29b-41d4-a716-446655440006",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "category": "career",
      "patternType": "high_confidence_success",
      "description": "Decisions with confidence > 7 have 85% satisfaction.",
      "strength": 0.85,
      "decisionCount": 8,
      "averageSatisfaction": 8.1,
      "createdAt": "2026-03-28T17:00:00.000Z"
    }
  ]
}
```

---

### 6.3 Get Decision Quality Over Time

`GET /api/v1/analytics/decision-quality-over-time`

**Response `200 OK`**
```json
{
  "data": {
    "timeline": [
      { "month": "2026-01", "avgSatisfaction": 6.5, "outcomeCount": 4 },
      { "month": "2026-02", "avgSatisfaction": 7.2, "outcomeCount": 6 },
      { "month": "2026-03", "avgSatisfaction": 7.8, "outcomeCount": 8 }
    ]
  }
}
```

---

### 6.4 Get Insights

`GET /api/v1/analytics/insights`

**Query Params:** `?dismissed=true` to include dismissed insights (default: false only)

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "bb1e8400-e29b-41d4-a716-446655440007",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "insightType": "pattern",
      "title": "Your career decisions have high success rates",
      "description": "8 of 9 career decisions have satisfaction > 7.",
      "dismissed": false,
      "createdAt": "2026-03-28T17:00:00.000Z"
    }
  ]
}
```

---

### 6.5 Dismiss Insight

`POST /api/v1/analytics/insights/:id/dismiss`

**Response `200 OK`**
```json
{
  "data": {
    "id": "bb1e8400-e29b-41d4-a716-446655440007",
    "dismissed": true,
    "dismissedAt": "2026-03-28T18:00:00.000Z"
  }
}
```

---

## 7. AI Engine

> All routes: `Authorization: Bearer <accessToken>`
> Note: AI responses are placeholder stubs until a live LLM is connected.

### 7.1 Analyze Decision

`POST /api/v1/ai/analyze-decision`

**Request Body**

| Field | Type | Required |
|-------|------|----------|
| `decisionId` | UUID | NO |
| `prompt` | string | NO |

**Request Body Example**
```json
{
  "decisionId": "771e8400-e29b-41d4-a716-446655440002",
  "prompt": "Help me analyze the risks of this career decision."
}
```

**Response `200 OK`**
```json
{
  "data": {
    "analysis": {
      "summary": "Based on your decision context, here are the key factors to consider.",
      "strengths": [
        "Clear objective defined",
        "Multiple alternatives considered"
      ],
      "risks": [
        "Timeline may be ambitious",
        "External dependencies not fully mapped"
      ],
      "suggestions": [
        "Consider breaking this into smaller decisions",
        "Set measurable milestones for tracking progress",
        "Identify a fallback plan if key assumptions fail"
      ],
      "confidenceAssessment": "Your confidence level appears reasonable given the information provided."
    },
    "interactionId": "cc1e8400-e29b-41d4-a716-446655440008"
  }
}
```

---

### 7.2 Recommend Approach

`POST /api/v1/ai/recommend-approach`

**Request Body**

| Field | Type | Required |
|-------|------|----------|
| `decisionId` | UUID | NO |
| `prompt` | string | NO |
| `context` | object | NO |

**Request Body Example**
```json
{
  "decisionId": "771e8400-e29b-41d4-a716-446655440002",
  "prompt": "What framework should I use?",
  "context": { "urgency": "medium", "reversibility": "low" }
}
```

**Response `200 OK`**
```json
{
  "data": {
    "recommendation": {
      "recommendedApproach": "A structured decision framework is recommended.",
      "framework": "Pros/Cons Analysis with Weighted Criteria",
      "steps": [
        "List all options clearly",
        "Define evaluation criteria and assign weights",
        "Score each option against criteria",
        "Consider emotional and practical factors",
        "Make your decision and document reasoning"
      ],
      "timelineAdvice": "Allow adequate time for reflection before finalizing."
    },
    "interactionId": "cc1e8400-e29b-41d4-a716-446655440009"
  }
}
```

---

### 7.3 Find Similar Decisions

`GET /api/v1/ai/similar-decisions`

**Query Params:** `?decision_id=<uuid>` (optional)

**Response `200 OK`**
```json
{
  "data": {
    "similar": [],
    "message": "Vector similarity search requires embeddings to be generated for decisions."
  }
}
```

> Note: Returns empty until pgvector embeddings are populated.

---

### 7.4 Chat with AI Advisor

`POST /api/v1/ai/chat`

Creates a new session automatically if no `sessionId` provided.

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `message` | string | YES | |
| `sessionId` | UUID | NO | Continue existing session |
| `decisionId` | UUID | NO | Associate with a decision |

**New Session Example**
```json
{
  "message": "I'm considering leaving my job to start a startup. How do I think through this?",
  "decisionId": "771e8400-e29b-41d4-a716-446655440002"
}
```

**Response `200 OK`**
```json
{
  "data": {
    "sessionId": "dd1e8400-e29b-41d4-a716-446655440010",
    "reply": "Thank you for sharing. I can help you think through this decision. Could you tell me more about the specific factors you're weighing? Understanding your priorities will help me provide better guidance."
  }
}
```

**Continue Session Example**
```json
{
  "sessionId": "dd1e8400-e29b-41d4-a716-446655440010",
  "message": "My main concern is financial stability."
}
```

**Error `400`** `{ "error": "Message is required" }`

---

### 7.5 Get Chat Sessions

`GET /api/v1/ai/chat/sessions`

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "dd1e8400-e29b-41d4-a716-446655440010",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "decisionId": "771e8400-e29b-41d4-a716-446655440002",
      "title": "I'm considering leaving my job to start a startup...",
      "messageCount": 4,
      "totalTokensUsed": 0,
      "lastMessageAt": "2026-03-28T17:30:00.000Z",
      "createdAt": "2026-03-28T17:00:00.000Z"
    }
  ]
}
```

---

### 7.6 Get Chat History

`GET /api/v1/ai/chat/sessions/:id`

**Response `200 OK`**
```json
{
  "data": {
    "session": {
      "id": "dd1e8400-e29b-41d4-a716-446655440010",
      "title": "I'm considering leaving my job...",
      "messageCount": 4,
      "lastMessageAt": "2026-03-28T17:30:00.000Z"
    },
    "messages": [
      {
        "id": "ee1e8400-e29b-41d4-a716-446655440011",
        "sessionId": "dd1e8400-e29b-41d4-a716-446655440010",
        "role": "user",
        "content": "I'm considering leaving my job to start a startup.",
        "metadata": null,
        "createdAt": "2026-03-28T17:00:00.000Z"
      },
      {
        "id": "ee1e8400-e29b-41d4-a716-446655440012",
        "sessionId": "dd1e8400-e29b-41d4-a716-446655440010",
        "role": "assistant",
        "content": "Thank you for sharing. I can help you think through this decision...",
        "metadata": { "model": "lifeos-chat-v1", "tokensUsed": 0, "processingTime": 0 },
        "createdAt": "2026-03-28T17:00:01.000Z"
      }
    ]
  }
}
```

**Error `404`** `{ "error": "Chat session not found" }`

---

## 8. Notifications

> All routes: `Authorization: Bearer <accessToken>`

### 8.1 List Notifications

`GET /api/v1/notifications`

**Query Params:** `?read=true` | `?read=false` | omit for all

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "ff1e8400-e29b-41d4-a716-446655440013",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "type": "checkin_reminder",
      "title": "Time to check in!",
      "body": "It's been 1 month since your decision. How did it go?",
      "read": false,
      "readAt": null,
      "metadata": { "decisionId": "771e8400-e29b-41d4-a716-446655440002" },
      "createdAt": "2026-04-01T09:00:00.000Z"
    }
  ]
}
```

---

### 8.2 Mark Notification as Read

`PATCH /api/v1/notifications/:id/read`

**Response `200 OK`**
```json
{
  "data": {
    "id": "ff1e8400-e29b-41d4-a716-446655440013",
    "read": true,
    "readAt": "2026-04-01T10:00:00.000Z"
  }
}
```

---

### 8.3 Mark All as Read

`POST /api/v1/notifications/mark-all-read`

**Response `200 OK`**
```json
{ "message": "All notifications marked as read" }
```

---

### 8.4 Delete Notification

`DELETE /api/v1/notifications/:id`

**Response `204 No Content`**

---

## 9. Decision Frameworks

> All routes: `Authorization: Bearer <accessToken>`
> Visibility: own frameworks + public frameworks + system frameworks

### 9.1 List Frameworks

`GET /api/v1/frameworks`

**Query Params:** `?category=career` (optional)

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "gg1e8400-e29b-41d4-a716-446655440014",
      "userId": null,
      "name": "Pros/Cons Weighted Matrix",
      "description": "Systematic option evaluation with weighted criteria.",
      "category": "career",
      "framework": {
        "steps": [
          {
            "title": "Define your options",
            "description": "List all alternatives clearly.",
            "questions": ["What are all possible choices?"]
          }
        ],
        "criteria": [
          { "name": "Financial impact", "weight": 0.3 },
          { "name": "Career growth", "weight": 0.4 },
          { "name": "Work-life balance", "weight": 0.3 }
        ]
      },
      "usageCount": 45,
      "isPublic": true,
      "isSystemFramework": true,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 9.2 Get Framework

`GET /api/v1/frameworks/:id`

**Response `200 OK`**
```json
{
  "data": {
    "id": "gg1e8400-e29b-41d4-a716-446655440014",
    "name": "Pros/Cons Weighted Matrix",
    "framework": { "steps": [], "criteria": [] },
    "isSystemFramework": true,
    "isPublic": true
  }
}
```

---

### 9.3 Create Framework

`POST /api/v1/frameworks`

**Request Body**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | YES |
| `framework` | object | YES |
| `description` | string | NO |
| `category` | string | NO |
| `isPublic` | boolean | NO (default false) |

**Request Body Example**
```json
{
  "name": "My Career Decision Framework",
  "description": "Personal framework for career choices.",
  "category": "career",
  "isPublic": false,
  "framework": {
    "steps": [
      {
        "title": "Assess financial impact",
        "description": "Short and long-term financials.",
        "questions": ["Will income increase in 1 year?", "What are the financial risks?"]
      }
    ],
    "criteria": [
      { "name": "Salary", "weight": 0.35 },
      { "name": "Learning", "weight": 0.40 },
      { "name": "Stability", "weight": 0.25 }
    ]
  }
}
```

**Response `201 Created`**
```json
{
  "data": {
    "id": "hh1e8400-e29b-41d4-a716-446655440015",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Career Decision Framework",
    "category": "career",
    "isPublic": false,
    "isSystemFramework": false,
    "createdAt": "2026-03-28T17:00:00.000Z"
  }
}
```

**Error `400`** `{ "error": "Name and framework are required" }`

---

### 9.4 Update Framework

`PATCH /api/v1/frameworks/:id`

Can only update own frameworks. Fields: `name`, `description`, `category`, `framework`, `isPublic`.

**Request Body**
```json
{
  "isPublic": true,
  "description": "Now sharing this publicly."
}
```

**Response `200 OK`**
```json
{
  "data": {
    "id": "hh1e8400-e29b-41d4-a716-446655440015",
    "isPublic": true,
    "updatedAt": "2026-03-28T18:00:00.000Z"
  }
}
```

---

### 9.5 Delete Framework

`DELETE /api/v1/frameworks/:id`

Can only delete own frameworks.

**Response `204 No Content`**

---

## 10. Decision Templates

> All routes: `Authorization: Bearer <accessToken>`

### 10.1 List Templates

`GET /api/v1/templates`

**Query Params:** `?category=career` (optional)

**Response `200 OK`**
```json
{
  "data": [
    {
      "id": "ii1e8400-e29b-41d4-a716-446655440016",
      "userId": null,
      "name": "Career Change Template",
      "description": "Guided template for job transitions.",
      "category": "career",
      "template": {
        "titlePrompt": "Describe the career move in one sentence.",
        "descriptionPrompt": "What prompted this consideration?",
        "contextQuestions": [
          "What is your current situation?",
          "What drives this decision?",
          "What are your long-term goals?"
        ],
        "expectedOutcomePrompts": [
          "What salary/title change do you expect?",
          "What skills will you gain?"
        ],
        "suggestedTags": ["career", "job-change", "growth"],
        "checkInIntervals": ["1_month", "3_months", "6_months", "1_year"]
      },
      "usageCount": 120,
      "isPublic": true,
      "isSystemTemplate": true,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 10.2 Get Template

`GET /api/v1/templates/:id`

**Response `200 OK`**
```json
{
  "data": {
    "id": "ii1e8400-e29b-41d4-a716-446655440016",
    "name": "Career Change Template",
    "category": "career",
    "isSystemTemplate": true
  }
}
```

---

### 10.3 Create Template

`POST /api/v1/templates`

**Request Body**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | YES |
| `category` | string | YES |
| `template` | object | YES |
| `description` | string | NO |
| `isPublic` | boolean | NO (default false) |

**Request Body Example**
```json
{
  "name": "Investment Decision Template",
  "description": "For evaluating financial investments.",
  "category": "financial",
  "isPublic": false,
  "template": {
    "titlePrompt": "Describe the investment in one sentence.",
    "descriptionPrompt": "What opportunity are you evaluating?",
    "contextQuestions": [
      "What is the investment amount?",
      "What is your risk tolerance?"
    ],
    "expectedOutcomePrompts": [
      "What ROI do you expect?",
      "What is the timeline?"
    ],
    "suggestedTags": ["investment", "financial", "risk"],
    "checkInIntervals": ["3_months", "6_months", "1_year", "2_years"]
  }
}
```

**Response `201 Created`**
```json
{
  "data": {
    "id": "jj1e8400-e29b-41d4-a716-446655440017",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Investment Decision Template",
    "category": "financial",
    "isPublic": false,
    "isSystemTemplate": false,
    "createdAt": "2026-03-28T17:00:00.000Z"
  }
}
```

**Error `400`** `{ "error": "Name, category, and template are required" }`

---

### 10.4 Update Template

`PATCH /api/v1/templates/:id`

Fields: `name`, `description`, `category`, `template`, `isPublic`.

**Request Body**
```json
{
  "name": "Investment Decision Template v2",
  "isPublic": true
}
```

**Response `200 OK`**
```json
{
  "data": {
    "id": "jj1e8400-e29b-41d4-a716-446655440017",
    "name": "Investment Decision Template v2",
    "isPublic": true,
    "updatedAt": "2026-03-28T18:00:00.000Z"
  }
}
```

---

### 10.5 Delete Template

`DELETE /api/v1/templates/:id`

**Response `204 No Content`**

---

## 11. Enum Reference

### Decision Category
| Value | Description |
|-------|-------------|
| `career` | Job changes, promotions, skills |
| `financial` | Investments, purchases, savings |
| `health` | Diet, exercise, medical |
| `relationship` | Personal & professional relationships |
| `education` | Courses, degrees, certifications |
| `lifestyle` | Habits, hobbies, living arrangements |
| `business` | Entrepreneurship, partnerships |
| `personal_growth` | Self-improvement, mindset |
| `family` | Family planning, parenting |
| `other` | Catch-all |

### Decision Status
| Value | Description |
|-------|-------------|
| `active` | Current and tracked |
| `archived` | No longer active, kept for history |
| `superseded` | Replaced by another decision |
| `deleted` | Soft-deleted |

### Outcome Reminder Type
| Value |
|-------|
| `1_day` |
| `1_week` |
| `2_weeks` |
| `1_month` |
| `3_months` |
| `6_months` |
| `1_year` |
| `2_years` |
| `custom` |

### Reminder Status
| Value | Description |
|-------|-------------|
| `pending` | Not yet actioned |
| `sent` | Notification dispatched |
| `completed` | User recorded an outcome |
| `skipped` | User opted to skip |
| `failed` | Delivery failed |

### User Role
`user` | `admin` | `premium`

---

## 12. Common Error Responses

| Status | Body | Trigger |
|--------|------|---------|
| `400` | `{ "error": "..." }` | Missing or invalid fields |
| `401` | `{ "error": "Unauthorized" }` | No / missing Bearer token |
| `401` | `{ "error": "Invalid token" }` | Expired or tampered JWT |
| `404` | `{ "error": "... not found" }` | Resource missing or belongs to another user |
| `409` | `{ "error": "User already exists" }` | Duplicate email on register |
| `500` | `{ "error": "Internal server error" }` | Unhandled server exception |

---

## Authentication Flow (Quick Reference)

```
1. Register/Login  →  { accessToken, refreshToken }
2. All API calls   →  Authorization: Bearer <accessToken>
3. Token expired   →  POST /api/v1/auth/refresh { refreshToken }
4. Logout          →  POST /api/v1/auth/logout  { refreshToken }
```

| Token | Expiry | Notes |
|-------|--------|-------|
| Access Token | 7d (JWT_EXPIRY env var) | JWT, stateless |
| Refresh Token | 30d | Single-use, rotated on refresh |
