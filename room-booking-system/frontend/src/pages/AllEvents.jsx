import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

import EventCard from "../components/EventCard";
import { eventsApi } from "../lib/api";

import { LoadingSkeleton } from "../components/ui/Loading";
import { Alert } from "../components/ui/Alert";


/* ---------- Section Header ---------- */

function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-16">

      <p className="text-yellow-500 uppercase tracking-[0.35em] text-sm mb-4">
        Hotel Experiences
      </p>

      <h2 className="text-4xl md:text-5xl font-semibold text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}

      <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-6"></div>

    </div>
  );
}


/* ---------- PAGE ---------- */

export default function AllEvents() {

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /* ---------- FETCH EVENTS ---------- */

  useEffect(() => {

    const fetchEvents = async () => {

      try {

        const res = await eventsApi.getPublished();
        const data = res?.data?.data || [];

        setEvents(data);

      } catch (err) {

        console.error(err);
        setError("Failed to load events");

      } finally {

        setLoading(false);

      }

    };

    fetchEvents();

  }, []);



  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen">


      {/* HERO */}

      <section className="relative h-[55vh] flex items-center justify-center text-center">

        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
          alt="events"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 px-6">

          <div className="flex justify-center mb-4">
            <CalendarDays size={40} className="text-yellow-500"/>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold mb-4">
            Hotel Events
          </h1>

          <p className="text-gray-300 max-w-xl mx-auto">
            Discover unforgettable experiences and exclusive events hosted at our luxury hotel.
          </p>

        </div>

      </section>



      {/* EVENTS LIST */}

      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <SectionHeader
            title="Upcoming Luxury Events"
            subtitle="Celebrate unforgettable moments with curated experiences."
          />


          {error && (
            <Alert type="error" message={error} />
          )}


          {/* LOADING */}

          {loading && (
            <LoadingSkeleton count={6} />
          )}


          {/* EVENTS GRID */}

          {!loading && events.length > 0 && (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

              {events.map((event) => (

                <EventCard
                  key={event._id}
                  event={event}
                  onView={(id) => navigate(`/events/${id}`)}
                />

              ))}

            </div>

          )}


          {/* EMPTY STATE */}

          {!loading && events.length === 0 && (

            <div className="text-center py-20">

              <CalendarDays
                size={60}
                className="text-gray-500 mx-auto mb-6"
              />

              <h3 className="text-xl font-semibold mb-2">
                No Events Available
              </h3>

              <p className="text-gray-400">
                Please check back later for upcoming events.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* CTA */}

      <section className="py-28 bg-[#111] text-center">

        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-4xl font-semibold mb-6">
            Host Your Own Event
          </h2>

          <p className="text-gray-400 mb-10">
            Our luxury venues are perfect for weddings, corporate gatherings, and private celebrations.
          </p>

          <button
            onClick={() => window.location.href = "/contact"}
            className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Contact Us
          </button>

        </div>

      </section>


    </div>
  );
}