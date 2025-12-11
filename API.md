# API Documentation

## Overview

This document describes all available API routes in the OG Event application. All routes use Next.js App Router route handlers.

**Base URL**: `http://localhost:3000` (development) or your deployment URL

---

## Table of Contents

1. [Booking APIs](#booking-apis)
2. [Ticket Generation](#ticket-generation)
3. [Storage APIs](#storage-apis)
4. [Admin APIs](#admin-apis)
5. [Authentication](#authentication)

---

## Booking APIs

### Book Seats

Create a new booking for selected seats.

**Endpoint**: `POST /api/book-seats`

**Authentication**: None required

**Request Body**:

```typescript
{
  name: string;
  email: string;
  phone: string;
  selectedSeats: Array<{
    id: string;
    category: string;
  }>;
}
```

**Response** (Success):

```typescript
{
  success: true;
  bookingId: string;
  message: 'Booking created successfully';
}
```

**Response** (Error):

```typescript
{
  success: false;
  message: string;
  error?: string;
}
```

**Example**:

```bash
curl -X POST http://localhost:3000/api/book-seats \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "selectedSeats": [
      { "id": "seat-1", "category": "VIP" },
      { "id": "seat-2", "category": "Regular" }
    ]
  }'
```

---

### Approve Booking

Approve a pending booking (Admin only).

**Endpoint**: `POST /api/approve-booking`

**Authentication**: Required (Admin)

**Request Body**:

```typescript
{
  bookingId: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

---

### Reject Booking

Reject a pending booking (Admin only).

**Endpoint**: `POST /api/reject-booking`

**Authentication**: Required (Admin)

**Request Body**:

```typescript
{
  bookingId: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

---

## Ticket Generation

### Generate Combined Ticket PDF

Generate a single PDF with all tickets for a booking.

**Endpoint**: `POST /api/generate-tickets-pdf`

**Authentication**: None required

**Request Body**:

```typescript
{
  bookingId: string;
}
```

**Response**: PDF file download

---

### Generate Separate Ticket PDFs

Generate individual PDF files for each ticket.

**Endpoint**: `POST /api/generate-separate-tickets-pdf`

**Authentication**: None required

**Request Body**:

```typescript
{
  bookingId: string;
}
```

**Response**: ZIP file with individual ticket PDFs

---

## Storage APIs

### Create Storage Bucket

Create a new Supabase storage bucket (Admin only).

**Endpoint**: `POST /api/create-bucket`

**Authentication**: Required (Admin)

**Request Body**:

```typescript
{
  bucketName: string;
  isPublic?: boolean;
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

---

### List Storage Buckets

List all available storage buckets (Admin only).

**Endpoint**: `GET /api/list-buckets`

**Authentication**: Required (Admin)

**Response**:

```typescript
{
  success: boolean;
  buckets?: Array<{ id: string; name: string; public: boolean }>;
  error?: string;
}
```

---

### Image Proxy

Proxy images from Supabase storage with authentication.

**Endpoint**: `GET /api/image-proxy?path={imagePath}`

**Authentication**: Required (Admin for private images)

**Query Parameters**:

- `path` (string): Path to the image in storage

**Response**: Image file

---

## Admin APIs

Admin routes are protected and require authentication via Supabase Auth.

### Server Actions

Located in `/app/og-admin/*/actions.ts`:

#### Bookings Actions

- `fetchBookings()` - Get all bookings
- `updateBookingStatus(bookingId, status)` - Update booking status
- `deleteBooking(bookingId)` - Delete a booking

#### Pending Bookings Actions

- `fetchPendingBookings()` - Get all pending bookings
- `approveBooking(bookingId)` - Approve booking
- `rejectBooking(bookingId)` - Reject booking

#### Booked Orders Actions

- `fetchBookedOrders()` - Get all approved bookings
- `cancelOrder(bookingId)` - Cancel an approved order
- `generateTickets(bookingId)` - Generate tickets for order

---

## Authentication

### Protected Routes

Routes under `/og-admin/*` require authentication:

- User must be logged in via Supabase Auth
- Session checked by middleware
- Redirects to `/auth/login` if not authenticated

### Auth Flow

1. User navigates to `/og-admin`
2. Middleware checks for active session
3. If no session, redirect to `/auth/login`
4. After login, user can access admin routes

### Auth Methods

- **Email/Password**: Via Supabase Auth
- **Session**: Managed by Supabase SSR

---

## Error Handling

All API routes follow a consistent error response format:

```typescript
{
  success: false,
  error: string,
  message?: string
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:

- Use Vercel Edge Config
- Implement per-IP or per-user limits
- Add to middleware

---

## CORS

CORS is configured via Next.js defaults:

- Same-origin requests allowed
- Configure in `next.config.ts` if needed for external clients

---

## Request Examples

### TypeScript/JavaScript

```typescript
// Book seats
const response = await fetch('/api/book-seats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    selectedSeats: [{ id: 'seat-1', category: 'VIP' }],
  }),
});

const data = await response.json();

if (data.success) {
  console.log('Booking ID:', data.bookingId);
}
```

### Using Constants

```typescript
import { API_ROUTES } from '@/lib/constants';

const response = await fetch(API_ROUTES.BOOK_SEATS, {
  method: 'POST',
  // ...
});
```

---

## Testing APIs

### Using Thunder Client / Postman

1. **Import** collection (if available)
2. **Set** base URL to `http://localhost:3000`
3. **Add** headers: `Content-Type: application/json`
4. **Test** each endpoint

### Using curl

See examples in each endpoint section above.

---

## Best Practices

1. **Always validate input** on the server side
2. **Use TypeScript types** from `@/types` for consistency
3. **Handle errors gracefully** and return meaningful messages
4. **Log errors** for debugging but don't expose sensitive info
5. **Use constants** from `@/lib/constants` for API routes

---

## Future Improvements

- [ ] Add rate limiting
- [ ] Implement API versioning (e.g., `/api/v1/`)
- [ ] Add request validation with Zod schemas
- [ ] Add OpenAPI/Swagger documentation
- [ ] Implement webhook endpoints
- [ ] Add webhook signature verification

---

## Related Documentation

- [Architecture Documentation](./ARCHITECTURE.md) - System design
- [Quick Reference](./QUICK_REFERENCE.md) - Common patterns
- [Contributing Guide](./CONTRIBUTING.md) - Development workflow
