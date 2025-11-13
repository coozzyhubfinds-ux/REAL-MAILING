# API Reference

All endpoints reside under `/api`. Responses follow the shape:

```json
{
  "success": true,
  "data": {}
}
```

Errors follow:

```json
{
  "success": false,
  "error": {
    "message": "Human readable description",
    "details": {}
  }
}
```

---

## Leads

### `GET /api/leads`

Retrieve leads with optional filters.

- **Query Parameters**
  - `limit` (number)
  - `status` (string)
  - `search` (string; matches name/email/channel)
- **Response**

```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "name": "Creator One",
        "email": "creator@example.com",
        "channel_name": "Creator Channel",
        "platform": "YouTube",
        "status": "new",
        "created_at": "2025-11-13T18:22:00Z"
      }
    ]
  }
}
```

### `POST /api/leads`

Create a new lead.

- **Body**

```json
{
  "name": "Creator One",
  "email": "creator@example.com",
  "channel_name": "Creator Channel",
  "platform": "YouTube",
  "recent_video_url": "https://youtube.com/watch?v=123"
}
```

- **Response**: lead record.

### `POST /api/leads/import`

Bulk import leads via JSON or CSV.

- **JSON Body**

```json
{
  "leads": [
    {
      "name": "Creator One",
      "email": "creator@example.com"
    }
  ]
}
```

- **CSV Upload**: multipart/form-data with field `file`.
- **Response**

```json
{ "success": true, "data": { "inserted": 25, "duplicates": 2 } }
```

### `PUT /api/leads/:id`

Update a lead partially.

- **Body**: Any updatable fields.
- **Response**: Updated lead.

### `DELETE /api/leads/:id`

Delete a lead.

- **Response**

```json
{ "success": true, "data": { "id": "uuid" } }
```

---

## Templates

### `GET /api/templates`

List templates.

```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "uuid",
        "name": "Product Launch",
        "subject": "Quick intro",
        "body": "Hi {{ name }}, ...",
        "created_at": "2025-11-13T18:22:00Z"
      }
    ]
  }
}
```

### `POST /api/templates`

Create a template.

- **Body**

```json
{
  "name": "Creator Outreach",
  "subject": "Loved {{ channel_name }}!",
  "body": "Hi {{ name }},\n{{ personal_intro }}\n..."
}
```

### `GET /api/templates/:id`

Fetch a single template.

### `PUT /api/templates/:id`

Update template data.

### `DELETE /api/templates/:id`

Remove template.

---

## Campaigns

### `POST /api/campaigns`

Create a campaign linking a template and leads.

- **Body**

```json
{
  "name": "Launch Collab Push",
  "templateId": "uuid",
  "leadIds": ["uuid"],
  "schedule": {
    "batchSize": 20,
    "startAt": "2025-11-14T10:00:00Z"
  }
}
```

- **Response**: campaign record.

### `GET /api/campaigns/:id`

Retrieve campaign status, associated leads, and progress metrics.

### `POST /api/campaigns/:id/send`

Trigger immediate sending for a campaign.

- **Response**

```json
{
  "success": true,
  "data": {
    "campaignId": "uuid",
    "queued": 40,
    "skipped": 2
  }
}
```

### `POST /api/campaigns/:id/preview`

Return sample personalized payloads.

- **Body**

```json
{ "limit": 3 }
```

- **Response**

```json
{
  "success": true,
  "data": {
    "previews": [
      {
        "leadId": "uuid",
        "subject": "Loved Creator Channel!",
        "body": "Hi Creator One,\nI checked out your channel..."
      }
    ]
  }
}
```

---

## Analytics

### `GET /api/analytics`

Fetch aggregated stats.

- **Response**

```json
{
  "success": true,
  "data": {
    "totals": {
      "leads": 120,
      "emailsSent": 340,
      "opens": 210,
      "replies": 48
    },
    "openRate": 0.62,
    "replyRate": 0.14,
    "recentActivity": [
      {
        "type": "email_sent",
        "lead": "Creator One",
        "timestamp": "2025-11-13T18:22:00Z"
      }
    ]
  }
}
```

---

All endpoints require no authentication by default; add middleware for production as needed.

