import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import AllEvents from "./pages/AllEvents";
import RoomDetail from "./pages/RoomDetail";
import EventDetail from "./pages/EventDetail";
import BookingPage from "./pages/BookingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/Rooms";
import AdminEvents from "./pages/admin/Events";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import {NotFoundPage} from "./pages/NotFoundPage";

function App() {
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
            {/* Show Navbar only for non-admin pages */}
            {!window.location.pathname.startsWith("/admin") && <Navbar />}

            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/book/:roomId" element={<BookingPage />} />
                <Route path="/rooms" element={<AllRooms />} />
                <Route path="/events" element={<AllEvents />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/rooms" element={<AdminRooms />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                </Route>

                {/* 404 */}
                <Route
                  path="*"
                  element={<NotFoundPage />}
                />
              </Routes>
            </main>

            {!window.location.pathname.startsWith("/admin") && <Footer />}
          </div>

          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;