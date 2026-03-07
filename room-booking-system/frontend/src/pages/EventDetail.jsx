// src/pages/EventDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, MapPin } from "lucide-react";

import { eventsApi } from "../lib/api";
import { LoadingSkeleton } from "../components/ui/Loading";
import { Alert } from "../components/ui/Alert";
import { formatDate } from "../utils/helpers";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- FETCH EVENT ---------- */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsApi.getById(id);
        const data = res?.data?.data;
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen py-32 px-6">
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen py-32 px-6">
        <Alert type="error" message={error || "Event not found"} />
      </div>
    );
  }

  const images = event.images?.map((img) => img) || [];

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen">

      {/* HERO */}
      <section className="relative h-[60vh] flex items-end">
        <img
          src={images[0] || "https://i.sstatic.net/y9DpT.jpg"}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 mb-6"
          >
            <ArrowLeft size={18}/>
            Back to Events
          </button>

          <div className="flex items-center gap-3 text-yellow-500 mb-4">
            <Calendar size={18}/>
            <span className="text-sm tracking-wide uppercase">
              {formatDate(event.eventDate, "MMMM dd, yyyy")}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold max-w-3xl leading-tight">
            {event.title}
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* IMAGE GALLERY */}
            {images.length > 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Event Gallery</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {images.slice(1).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="event"
                      className="rounded-xl object-cover h-64 w-full hover:scale-105 transition duration-500"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Event Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="text-yellow-500" size={18}/>
                  {formatDate(event.eventDate, "MMMM dd, yyyy")}
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-yellow-500" size={18}/>
                  LuxStay Grand Ballroom
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 text-black rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-3">Interested in this event?</h3>
              <p className="text-sm mb-6">
                Contact our team to learn more or reserve a private space for your own event.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/80 transition"
              >
                Contact Us
              </button>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}