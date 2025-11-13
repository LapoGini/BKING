# Calendar Feeds (ICS)

## Venue Calendar

Get all bookings for a venue in ICS format.

**Endpoint**: `GET /v1/cal/venue/{venueId}.ics`

**Authentication**: API Key

**Example**:
```
GET https://api.booking-saas.com/v1/cal/venue/660e8400-e29b-41d4-a716-446655440000.ics
X-API-Key: your-api-key
```

**Response**:
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Booking SaaS//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Ristorante Da Luigi - Bookings
X-WR-TIMEZONE:Europe/Rome

BEGIN:VEVENT
UID:booking-550e8400@booking-saas.com
DTSTAMP:20250115T180000Z
DTSTART:20250120T190000Z
DTEND:20250120T210000Z
SUMMARY:Booking - Mario Rossi (4 people)
DESCRIPTION:Service: Dinner\nParty Size: 4\nPhone: +39 333 1234567
LOCATION:Ristorante Da Luigi\, Via Roma 1\, Florence
STATUS:CONFIRMED
END:VEVENT

END:VCALENDAR
```

## Resource Calendar

Get bookings for a specific resource (table, room, etc.).

**Endpoint**: `GET /v1/cal/resource/{resourceId}.ics`

**Example**:
```
GET https://api.booking-saas.com/v1/cal/resource/770e8400-e29b-41d4-a716-446655440000.ics
X-API-Key: your-api-key
```

## Usage

Subscribe in calendar apps:
- **Google Calendar**: Add by URL
- **Apple Calendar**: File > New Calendar Subscription
- **Outlook**: Add Internet Calendar

**Note**: Feeds are refreshed every 15 minutes.
