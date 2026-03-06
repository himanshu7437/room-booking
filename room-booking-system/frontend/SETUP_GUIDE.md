# Frontend Setup & Running Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create/update `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```
App will run on `http://localhost:5173`

## What's Included

✅ **Complete React Frontend** with:
- Landing page with featured rooms & search
- Room detail page with gallery & availability checker
- Multi-step booking form with validation
- Admin login & dashboard
- Admin rooms & events management (CRUD)
- Real-time availability updates via Socket.io
- JWT authentication with protected routes
- Form validation with Zod
- Toast notifications
- Responsive design (mobile-first)
- Accessibility features
- Error boundary & loading states

✅ **Production-Ready Stack**:
- Vite (fast build & dev server)
- React 18+ with React Router v6
- Tailwind CSS v4 (custom color scheme)
- React Hook Form + Zod validation
- Axios with JWT interceptor
- Socket.io-client
- Lucide React icons
- React Hot Toast

## Project Structure

```
src/
├── components/        # Reusable UI & admin components
├── contexts/         # Auth state management
├── hooks/            # Custom hooks (useApi, useSocket)
├── lib/              # API client, Socket.io setup
├── pages/            # Page components
├── validations/      # Zod schemas
├── utils/            # Helpers & utilities
├── App.jsx           # Main routing
├── main.jsx          # Entry point
└── index.css         # Tailwind CSS
```

## Key Features

### Pages
- **/** - Landing with search bar & featured content
- **/rooms/:id** - Room detail with gallery & dates
- **/book/:roomId** - Booking form (multi-step)
- **/admin/login** - Admin authentication
- **/admin** - Dashboard with overview stats
- **/admin/rooms** - Room management (CRUD)
- **/admin/events** - Event management (CRUD)

### Components
- Reusable UI components (Button, Card, Input, Modal)
- Admin sidebar navigation
- Room & Event cards
- Error boundary
- Protected routes

### Validation
- Login form (email, password)
- Booking form (dates, customer info)
- Room form (name, description, price, capacity, amenities, images)
- Event form (title, description, date, video source, images)

## API Integration

The frontend is built to work with the backend APIs:

```
POST   /auth/login              - Admin login
GET    /rooms                   - List rooms
GET    /rooms/:id               - Room details
POST   /rooms                   - Create room
PUT    /rooms/:id               - Update room
DELETE /rooms/:id               - Delete room
GET    /bookings/:roomId/availability - Check availability
POST   /bookings                - Create booking
GET    /events/published        - Published events only
GET    /events                  - All events (admin)
POST   /events                  - Create event
PUT    /events/:id              - Update event
PATCH  /events/:id/publish      - Toggle publish
DELETE /events/:id              - Delete event
```

## Authentication

1. Navigate to `/admin/login`
2. Enter credentials (from backend)
3. JWT token saved to localStorage
4. Token automatically added to all API requests
5. Protected admin routes redirect to login if not authenticated

## Real-Time Features

Socket.io connection updates room availability in real-time:
- Auto-joins room channels on detail/booking pages
- Listens for 'availabilityUpdate' events
- Automatically refreshes availability status

## Styling

- **Colors**: Primary (indigo-600), Accent (teal-500), Gray neutrals
- **Spacing**: Tailwind default (4px unit)
- **Rounded**: md/lg for cards, buttons
- **Shadows**: md/lg with hover effects
- **Transitions**: 300ms for smooth animations
- **Responsive**: Mobile-first (md, lg, xl breakpoints)

## Development Tips

1. **Form Validation**: Zod schemas in `src/validations/schemas.js`
2. **API Calls**: Use hooks from `src/hooks/useApi.js`
3. **Notifications**: Use `showSuccessToast()` / `showErrorToast()`
4. **Images**: Lazy load with `loading="lazy"`
5. **Icons**: Import from `lucide-react`

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

- **"Cannot find module"**: Run `npm install`
- **API errors**: Check backend is running on port 5000
- **Login fails**: Verify credentials with backend
- **Images not loading**: Ensure backend serves image URLs
- **Socket not connecting**: Check backend Socket.io setup

## File Organization Tips

- UI components in `src/components/ui/`
- Page-specific logic in `src/pages/`
- Shared hooks in `src/hooks/`
- Validation schemas in `src/validations/`
- Utility functions in `src/utils/`

## Next Steps

1. Start backend on port 5000
2. Run `npm install` to install dependencies
3. Set up `.env.local` with API URL
4. Run `npm run dev` to start dev server
5. Navigate to `http://localhost:5173`
6. Test the application

---

**Ready to build amazing hotel booking experiences!** 🏨✨
