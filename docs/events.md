# Webhook Events

All webhook events are signed with HMAC-SHA256 using your webhook secret.

## Verify Signature

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

## Event Types

### booking.created

Fired when a new booking is created.

```json
{
  "event": "booking.created",
  "timestamp": "2025-01-15T18:30:00Z",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tenantId": "660e8400-e29b-41d4-a716-446655440000",
    "status": "pending",
    "startTime": "2025-01-20T19:00:00Z",
    "endTime": "2025-01-20T21:00:00Z",
    "customer": {
      "firstName": "Mario",
      "lastName": "Rossi",
      "email": "mario.rossi@example.com",
      "phone": "+39 333 1234567"
    },
    "partySize": 4,
    "services": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "Dinner"
      }
    ]
  }
}
```

### booking.updated

Fired when booking status changes.

```json
{
  "event": "booking.updated",
  "timestamp": "2025-01-20T19:05:00Z",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "arrived",
    "previousStatus": "confirmed",
    "updatedBy": {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "name": "Staff Member"
    }
  }
}
```

### booking.cancelled

Fired when booking is cancelled.

```json
{
  "event": "booking.cancelled",
  "timestamp": "2025-01-19T10:00:00Z",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "reason": "Customer requested",
    "cancelledBy": "customer"
  }
}
```

## Headers

```
X-Webhook-Signature: <hmac-sha256-hex>
X-Webhook-Timestamp: <unix-timestamp>
X-Webhook-Id: <unique-delivery-id>
Content-Type: application/json
```
