## Project Documentation

# LuxStay - Hotel Room Booking Frontend

A complete, production-ready React frontend for a premium hotel room booking website built with Vite, React 18+, and modern web technologies.

## 🎯 Features

### Public Pages
- **Landing Page (/)**: Hero section with date/guest search bar, featured rooms grid from API, upcoming events section
- **Room Detail (/rooms/:id)**: Full room gallery with main image + thumbnails, description, amenities, availability checker with date inputs, "Book Now" button
- **Booking Page (/book/:roomId)**: Multi-step form with dates summary, customer details (name/email/phone/guests), validation, success confirmation

### Admin Dashboard
- **Admin Login (/admin/login)**: Secure email/password login with JWT authentication
- **Admin Dashboard (/admin)**: Protected layout with sidebar, overview stats (room count, bookings, events)
- **Rooms Management (/admin/rooms)**: CRUD operations with table list, create/update/delete forms, image upload with preview
- **Events Management (/admin/events)**: Similar CRUD with image uploads, YouTube URL or video file upload, publish toggle button

### Real-Time Features
- Socket.io integration for real-time availability updates
- Auto-join room channels on detail/booking pages
- Listen for 'availabilityUpdate' events to refresh status

### Technical Features
- Global error boundary with fallback UI
- Loading skeletons for better UX
- Toast notifications (react-hot-toast)
- Form validation with Zod schemas
- JWT authentication with localStorage
- Axios interceptors for automatic JWT injection
- Protected routes with auth context
- Responsive mobile-first design (Tailwind CSS)
- Accessibility features (ARIA labels, keyboard navigation)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── Button.jsx               # Flexible button with variants
│   │   ├── Card.jsx                 # Card wrapper with header/body/footer
│   │   ├── Input.jsx                # Form input with error display
│   │   ├── FileInput.jsx            # File upload with drag-drop UI
│   │   ├── Modal.jsx                # Modal dialog component
│   │   ├── Loading.jsx              # Loading spinner & skeleton
│   │   ├── Alert.jsx                # Alert component (info/success/error/warning)
│   ├── admin/
│   │   ├── AdminSidebar.jsx         # Admin sidebar navigation
│   │   ├── RoomFormModal.jsx        # Room create/edit form
│   │   ├── EventFormModal.jsx       # Event create/edit form
│   ├── layout/
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   ├── Footer.jsx               # Footer with links
│   ├── RoomCard.jsx                 # Room display card
│   ├── EventCard.jsx                # Event display card
│   ├── ProtectedRoute.jsx           # Route guard for admin areas
│   ├── ErrorBoundary.jsx            # Error boundary wrapper
├── contexts/
│   └── AuthContext.jsx              # Auth state management (login/logout, JWT)
├── hooks/
│   ├── useApi.js                    # API call hook with loading/error states
│   └── useSocket.js                 # Socket.io connection hook
├── lib/
│   ├── api.js                       # Axios instance with JWT interceptor
│   └── socket.js                    # Socket.io initialization & helpers
├── pages/
│   ├── Home.jsx                     # Landing page with search bar & featured content
│   ├── RoomDetail.jsx               # Room detail with gallery & booking form
│   ├── BookingPage.jsx              # Multi-step booking form
│   └── admin/
│       ├── Login.jsx                # Admin login form
│       ├── Dashboard.jsx            # Admin overview dashboard
│       ├── Rooms.jsx                # Room management page
│       └── Events.jsx               # Event management page
├── validations/
│   └── schemas.js                   # Zod validation schemas
├── utils/
│   ├── helpers.js                   # Utility functions (formatDate, formatPrice, etc)
│   └── toast.js                     # Toast notification helpers
├── App.jsx                          # Main app with routing
├── main.jsx                         # Entry point
└── index.css                        # Tailwind CSS with custom layers

.env.local                           # Environment variables (see .env.example)
tailwind.config.js                   # Tailwind configuration with custom colors
vite.config.js                       # Vite configuration
```

## 🎨 Design System

### Color Scheme
- **Primary**: Indigo-600 (#4f46e5) - Main brand color
- **Accent**: Teal-500 (#14b8a6) - Highlights & CTAs
- **Neutral**: Gray (50/100/300/600/900) - Text, backgrounds, borders
- **Functional**: Green, Red, Blue, Yellow - Status indicators

### Typography
- **Font-family**: Inter-like sans-serif
- **Headings**: Bold with size scale (h1-h6)
- **Body**: Regular weight with appropriate line-height
- **Code**: Monospace for technical elements

### Components
- **Rounded Corners**: md (6px), lg (8px)
- **Shadows**: md on default, lg on hover
- **Transitions**: duration-300 for smooth animations
- **Spacing**: 4px base unit (Tailwind default)

## 🚀 Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Real-Time**: Socket.io-client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API
- **Dev Tools**: ESLint

## 📝 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on http://localhost:5000

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your API endpoint:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔌 API Integration

### Authentication
- **Endpoint**: `POST /auth/login`
- **Request**: `{ email, password }`
- **Response**: `{ token, admin }`
- **Token Storage**: localStorage with JWT interceptor

### Rooms
- `GET /rooms` - List all active rooms
- `GET /rooms/:id` - Get room details
- `POST /rooms` - Create room (form-data: name/desc/price/capacity/amenities/roomImages)
- `PUT /rooms/:id` - Update room (form-data)
- `DELETE /rooms/:id` - Delete/deactivate room
- `GET /bookings/:roomId/availability?checkIn=&checkOut=` - Check availability

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/:roomId/availability` - Check availability

### Events
- `GET /events/published` - List published events
- `GET /events` - List all events (admin)
- `POST /events` - Create event (form-data)
- `PUT /events/:id` - Update event
- `PATCH /events/:id/publish` - Toggle publish status
- `DELETE /events/:id` - Delete event

## 🔐 Authentication

1. Admin logs in via `/admin/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor automatically adds token to all requests:
   ```
   Authorization: Bearer <token>
   ```
5. 401 responses trigger logout and redirect to login

## 🎯 Form Validation

All forms use Zod schemas validated in real-time:

- **Login**: Email format + password min 6 chars
- **Booking**: Dates required, valid phone format, guest count 1-10
- **Rooms**: Name/desc length, numeric price/capacity, image files
- **Events**: Title/desc length, event date, video source (YouTube URL or file)

## 📱 Responsive Design

- **Mobile**: Single-column layout, stack elements vertically
- **Tablet (md)**: Two-column layouts for main content
- **Desktop (lg)**: Three-column layouts where applicable
- **XL**: Full-width optimization for 4K screens

## ♿ Accessibility

- Semantic HTML (button, input, section, etc)
- ARIA labels for icons and interactive elements
- Keyboard navigation support (Tab, Enter)
- Focus rings on interactive elements
- Color contrast ratios meet WCAG AA
- Form error messages linked to inputs

## 🚀 Performance Optimizations

- Lazy image loading with `loading="lazy"`
- Component memoization where appropriate
- Dynamic imports for route code-splitting
- Optimized Tailwind build (purge unused CSS)
- Grouped API requests with Promise.all

## 🛠️ Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📦 Dependencies Overview

| Package | Purpose |
|---------|---------|
| react-router-dom | Client-side routing |
| @hookform/resolvers | Form validation integration |
| axios | HTTP client with interceptors |
| zod | Schema validation |
| socket.io-client | Real-time websocket connection |
| react-hot-toast | Toast notifications |
| lucide-react | Icon library |
| tailwindcss | Utility-first CSS |
| date-fns | Date formatting |

## 🐛 Error Handling

- **Global**: ErrorBoundary component catches React errors
- **Network**: Axios interceptor handles 401, toasts for other errors
- **Form**: Zod validation with field-level error messages
- **UI**: Alert components for different severity levels
- **Loading**: Skeleton screens during data fetches

## 🔄 Real-Time Updates

Socket.io integration allows instant availability updates:

```javascript
// Join room channel
socket.emit('joinRoom', roomId);

// Listen for availability changes
socket.on('availabilityUpdate', (data) => {
  // Refresh availability status
});

// Leave room channel
socket.emit('leaveRoom', roomId);
```

## 📚 Additional Resources

- Tailwind CSS Docs: https://tailwindcss.com/docs
- React Router Docs: https://reactrouter.com
- React Hook Form Docs: https://react-hook-form.com
- Zod Documentation: https://zod.dev
- Socket.io Docs: https://socket.io/docs
- Lucide Icons: https://lucide.dev

## 📄 License

Production-ready code for the LuxStay hotel booking platform.

---

**Built with ❤️ for modern web development**
