import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { NotFoundPage } from "./pages/NotFoundPage";

// Components
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollManager from "./components/ScrollManager";
import ConciergeBot from "./components/chatbot/ConciergeBot";


function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<AllRooms />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/book/:roomId" element={<BookingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
          <ConciergeBot />
        </div>
      </ErrorBoundary>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;