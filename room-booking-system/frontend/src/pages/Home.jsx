import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
} from "lucide-react";

import RoomCard from "../components/RoomCard";
import EventCard from "../components/EventCard";

import { roomsApi, eventsApi } from "../lib/api";
import { LoadingSkeleton } from "../components/ui/Loading";
import { Alert } from "../components/ui/Alert";


/* ---------- Section Header ---------- */

function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <p className="text-yellow-500 uppercase tracking-[0.35em] text-sm mb-4">
        Luxury Experience
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



export default function Home() {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [error, setError] = useState(null);


  /* ---------- FETCH DATA ---------- */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [roomsRes, eventsRes] = await Promise.all([
          roomsApi.getList(),
          eventsApi.getPublished(),
        ]);

        const roomsData = roomsRes?.data?.data || [];
        const eventsData = eventsRes?.data?.data || [];

        const activeRooms = roomsData.filter(room => room.isActive === true);
        setRooms(activeRooms);
        setEvents(eventsData);

      } catch (err) {

        console.error(err);
        setError("Failed to load data");

      } finally {

        setLoadingRooms(false);
        setLoadingEvents(false);

      }

    };

    fetchData();

  }, []);



  return (
    <div className="bg-[#0c0c0c] text-white">


      {/* HERO */}

      <section className="relative h-screen flex items-center justify-center text-center">

        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          alt="hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-3xl px-6">

          <p className="text-yellow-500 uppercase tracking-[0.4em] text-sm mb-6">
            Welcome to LuxStay
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6">
            Experience Luxury
            <br />
            Like Never Before
          </h1>

          <p className="text-gray-300 mb-10">
            Discover elegant rooms, world-class amenities, and unforgettable
            experiences crafted for comfort and luxury.
          </p>

          <Link
            to="/rooms"
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Explore Rooms
          </Link>

        </div>

      </section>



      {/* ROOMS */}

      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <SectionHeader
            title="Our Signature Rooms & Suites"
            subtitle="Elegant rooms designed for relaxation and comfort."
          />

          {error && <Alert type="error" message={error} />}

          {loadingRooms ? (

            <LoadingSkeleton count={3} />

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

              {rooms.slice(0, 3).map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onViewDetails={(id) => navigate(`/rooms/${id}`)}
                  onBook={(id) => navigate(`/book/${id}`)}
                />
              ))}

            </div>

          )}

          <div className="text-center mt-12">

            <Link
              to="/rooms"
              className="text-yellow-500 hover:underline text-sm"
            >
              View All Rooms →
            </Link>

          </div>

        </div>

      </section>



      {/* AMENITIES */}

      <section className="py-28 bg-[#111]">

        <div className="max-w-7xl mx-auto px-6">

          <SectionHeader
            title="Exceptional Hotel Amenities"
            subtitle="Everything you need for a perfect stay."
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

            {[
              { icon: Wifi, label: "High Speed WiFi" },
              { icon: Car, label: "Free Parking" },
              { icon: Coffee, label: "Breakfast Included" },
              { icon: Waves, label: "Infinity Pool" },
              { icon: Dumbbell, label: "Fitness Center" },
              { icon: Utensils, label: "Fine Dining" },
            ].map((item, i) => {

              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group border border-white/10 p-8 rounded-xl text-center hover:border-yellow-500 transition"
                >

                  <Icon
                    size={36}
                    className="mx-auto mb-4 text-yellow-500 group-hover:scale-110 transition"
                  />

                  <p className="text-gray-300 text-sm">
                    {item.label}
                  </p>

                </div>
              );

            })}

          </div>

        </div>

      </section>



      {/* EVENTS */}

      <section className="py-28">

        <div className="max-w-7xl mx-auto px-6">

          <SectionHeader
            title="Exclusive Hotel Events"
            subtitle="Celebrate special moments with our curated events."
          />

          {loadingEvents ? (

            <LoadingSkeleton count={3} />

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

              {events.slice(0, 3).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onView={(id) => navigate(`/events/${id}`)}
                />
              ))}

            </div>

          )}

        </div>

      </section>



      {/* TESTIMONIALS */}

      <section className="py-28 bg-[#111]">

        <div className="max-w-7xl mx-auto px-6">

          <SectionHeader
            title="What Our Guests Say"
            subtitle="Trusted by thousands of guests worldwide."
          />

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                name: "Sarah Johnson",
                role: "Travel Blogger",
                text: "The most beautiful hotel I have stayed in. Everything from the rooms to the service was exceptional.",
              },
              {
                name: "Michael Chen",
                role: "Entrepreneur",
                text: "Absolutely incredible stay. Staff were amazing and facilities were world-class.",
              },
              {
                name: "Emily Carter",
                role: "Designer",
                text: "Elegant interiors, amazing food, and a relaxing atmosphere.",
              },
            ].map((t, i) => (

              <div
                key={i}
                className="bg-[#151515] border border-white/10 rounded-xl p-10 hover:border-yellow-500 transition"
              >

                <p className="text-gray-300 leading-relaxed mb-8">
                  "{t.text}"
                </p>

                <div className="border-t border-white/10 pt-4">

                  <p className="font-semibold">
                    {t.name}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {t.role}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* CTA */}

      <section className="py-28 text-center">

        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-4xl font-semibold mb-6">
            Ready for Your Luxury Stay?
          </h2>

          <p className="text-gray-400 mb-10">
            Book your room today and enjoy an unforgettable hospitality experience.
          </p>

          <Link
            to="/rooms"
            className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Book Your Stay
          </Link>

        </div>

      </section>


    </div>
  );
}