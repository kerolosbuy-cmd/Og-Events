# OG Event - Seat Map Application

An interactive seat map application for event booking with real-time seat availability, payment verification, and admin management.

## Architecture

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage (Payment proofs, tickets)
- **UI**: React 19, Tailwind CSS, Radix UI
- **PDF Generation**: jsPDF, html2canvas
- **Interactive Maps**: react-svg-pan-zoom

## Features

### User Features

- **Interactive Seat Selection**: Visual seat map with pan/zoom capabilities
- **Real-time Availability**: Live seat status updates
- **Guest Booking**: Book seats without registration
- **Payment Upload**: Upload payment proof for booking verification
- **Booking Timeout**: 10-minute window to complete payment
- **PDF Tickets**: Download individual or combined ticket PDFs
- **Responsive Design**: Works on desktop and mobile devices

### Admin Features

- **Booking Management**: View and manage all bookings
- **Payment Verification**: Review and approve payment proofs
- **Pending Approvals**: Dedicated dashboard for pending bookings
- **Ticket Designer**: Custom ticket layout editor
- **Settings Management**: Configure event details and pricing
- **Image Storage**: Manage event images and assets

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Basic knowledge of Next.js and React

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd og-event
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in your values:
   - See [`GET_SUPABASE_KEYS.md`](GET_SUPABASE_KEYS.md) for Supabase credentials
   - See [`SETUP_EMAIL_AUTH.md`](SETUP_EMAIL_AUTH.md) for auth configuration

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app                    # Next.js app router
  /api                 # API route handlers
    /book-seats        # Seat booking endpoint
    /create-bucket     # Storage bucket creation
  /auth                # Authentication pages
    /login             # Login page
  /og-admin            # Admin panel
    /bookings          # All bookings view
    /pending-bookings  # Pending approval view
    /booked-orders     # Confirmed bookings
    /settings          # Event settings
    /tickets           # Ticket designer
  /booking-confirmation # Booking success page
  /payment             # Payment upload page
  /test-buckets        # Storage testing

/components            # React components
  /seat-map           # Seat map components
    /hooks            # Custom hooks
    /utils            # Utility functions
  /ui                 # Reusable UI components (Radix UI)
  /icons              # Custom icons

/lib                  # Utility libraries
  /supabase          # Supabase clients
    client.ts        # Client-side operations
    server.ts        # Server-side operations
    proxy.ts         # Proxy configuration
    service.ts       # Service role client
  pdf-utils.ts       # PDF generation utilities
  storage.ts         # File upload utilities
  settings.ts        # Settings management
  utils.ts           # General utilities

/sql                  # SQL scripts
  create_test_booking.sql
  storage_policies.sql
  timeout_booking.sql

/config              # Configuration files
  settings.json      # Application settings

/types               # TypeScript type definitions
```

## Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:

```bash
npx tsc --noEmit
```

### Database Connection Issues

1. Verify your environment variables in `.env.local`
2. Check that your Supabase project URL and keys are correct
3. Ensure your IP is not blocked in Supabase settings
4. Verify RLS policies are properly configured

### Development Server Issues

If the dev server won't start:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Payment Upload Issues

1. Check Supabase Storage bucket is created (`payment-proofs`)
2. Verify storage policies in `/supabase/storage_policies.sql`
3. Check browser console for CORS errors
4. Ensure file size is under the limit (5MB)

## Development

### Running Locally

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Configuration

- **Next.js Config**: `next.config.ts`
- **Tailwind Config**: `tailwind.config.ts`
- **TypeScript Config**: `tsconfig.json`
- **ESLint Config**: `eslint.config.mjs`

## Learn More

### Technologies Used

- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework
- [React Documentation](https://react.dev) - React library
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [Supabase Documentation](https://supabase.com/docs) - Backend platform
- [Radix UI](https://www.radix-ui.com/) - Headless UI components

### Database Schema

See the `/sql` directory for database setup scripts:

- `storage_policies.sql` - Storage bucket policies
- `timeout_booking.sql` - Automated booking timeout
- `create_test_booking.sql` - Test data creation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
